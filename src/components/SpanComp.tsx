import * as React from 'react';

import {
    Color, BookRange, BookPath, isSimple, Span,
    isCompound, isAttributed, isFootnote,
    pathLessThan, FootnoteId, isPrefix, attrs,
} from '../model';
import {
    PlainText, point,
} from '../blocks';
import {
    assertNever, filterUndefined,
    TaggedRange, range, Range, overlaps,
} from '../utils';
import { RefPathHandler, pathToId } from './common';

export type ColorizedRange = {
    color: Color,
    range: BookRange,
};
export type Colorization = {
    ranges: ColorizedRange[],
};

export type SpanProps = {
    span: Span,
    path: BookPath,
    first: boolean,
    refPathHandler: RefPathHandler,
    colorization?: Colorization,
    fontSize: number,
    fontFamily: string,
    color: Color,
};
export function SpanComp(props: SpanProps) {
    const ranges = rangesForProps(props);
    const fullText = spanText(props.span);
    const children = ranges.map((r, idx) => {
        const rendering = foldRendering(r.tags);
        const text = fullText.substring(r.range.start, r.range.end);
        const path = props.path.concat(r.range.start);

        return <TextRun
            color={props.color}
            fontSize={props.fontSize}
            fontFamily={props.fontFamily}
            key={idx.toString()}
            {...rendering}
            text={text}
            path={path}
            refPathHandler={props.refPathHandler}
        />;
    });

    return <>{children}</>;
}

type TextRunProps = RenderingAttrs & {
    text: string,
    path: BookPath,
    refPathHandler: RefPathHandler,
};
// TODO: support footnotes
function TextRun(props: TextRunProps) {
    return <PlainText
        dropCaps={props.dropCaps}
        refHandler={ref => props.refPathHandler(ref, props.path)}
        background={props.background}
        id={pathToId(props.path)}
        style={{
            color: props.color,
            fontSize: props.fontSize,
            fontFamily: props.fontFamily,
            fontStyle: props.italic ? 'italic' : 'normal',
            fontWeight: props.bold ? 'bold' : 'normal',
            ...(props.line && {
                textIndent: point(2),
                display: 'block',
            }),
        }}>
        {props.text}
    </PlainText>;
}

type FootnoteData = {
    footnote: Span,
    id: FootnoteId,
    title: string[],
};

type RenderingAttrs = {
    color?: Color,
    background?: Color,
    fontSize?: number,
    fontFamily?: string,
    dropCaps?: boolean,
    italic?: boolean,
    bold?: boolean,
    line?: boolean,
    footnote?: FootnoteData,
};

type RenderingAttrsRange = TaggedRange<RenderingAttrs, number>;

function rangesForProps(props: SpanProps): RenderingAttrsRange[] {
    const spanRanges = rangesForSpan(props.span);
    const dropCaseRanges = props.first
        ? [{
            range: range(0, 1),
            tags: [{ dropCaps: true }],
        }]
        : [];

    const absoluteRanges = ((props.colorization && props.colorization.ranges) || []);
    const colorizationRanges = filterUndefined(
        absoluteRanges
            .map(cr => {
                const relative = rangeRelativeToPath(props.path, cr.range);
                return relative
                    ? {
                        tags: [{ background: cr.color }],
                        range: relative,
                    }
                    : undefined;
            })
    );

    const allRanges = spanRanges.concat(dropCaseRanges).concat(colorizationRanges);
    const result = overlaps(allRanges, (l, r) => l < r);

    return result;
}

function rangesForSpan(span: Span): RenderingAttrsRange[] {
    const result = rangesForSpanHelper(span, 0);
    return result.ranges;
}

function rangesForSpanHelper(span: Span, offset: number): {
    ranges: RenderingAttrsRange[],
    length: number,
} {
    if (isSimple(span)) {
        return {
            ranges: [{
                range: {
                    start: offset,
                    end: offset + span.length,
                },
                tags: [],
            }],
            length: span.length,
        };
    } else if (isAttributed(span)) {
        const inside = rangesForSpanHelper(span.content, offset);
        const current: RenderingAttrsRange = {
            range: {
                start: offset,
                end: offset + inside.length,
            },
            tags: [{
                italic: attrs(span).italic,
                bold: attrs(span).bold,
                line: attrs(span).line,
            }],
        };
        return {
            ranges: [current].concat(inside.ranges),
            length: inside.length,
        };
    } else if (isCompound(span)) {
        let ranges: RenderingAttrsRange[] = [];
        let currentOffset = offset;
        for (const s of span.spans) {
            const rs = rangesForSpanHelper(s, currentOffset);
            ranges = ranges.concat(rs.ranges);
            currentOffset += rs.length;
        }

        return {
            ranges,
            length: currentOffset - offset,
        };
    } else if (isFootnote(span)) {
        const inside = rangesForSpanHelper(span.content, offset);
        const current: RenderingAttrsRange = {
            range: {
                start: offset,
                end: offset + inside.length,
            },
            tags: [{
                footnote: {
                    footnote: span.footnote,
                    id: span.id,
                    title: span.title,
                },
            }],
        };
        return {
            ranges: [current].concat(inside.ranges),
            length: inside.length,
        };
    } else {
        return assertNever(span);
    }
}

function rangeRelativeToPath(path: BookPath, bookR: BookRange): Range<number> | undefined {
    if (bookR.end && pathLessThan(bookR.end, path)) {
        return undefined;
    }

    if (!pathLessThan(path, bookR.start)) {
        return range(0);
    }

    let start: number | undefined;
    if (isPrefix(path, bookR.start)) {
        start = bookR.start[path.length];
    }
    let end: number | undefined;
    if (bookR.end && isPrefix(path, bookR.end)) {
        end = bookR.end[path.length];
    }

    return start !== undefined
        ? range(start, end)
        : undefined;
}

function foldRendering(rendering: RenderingAttrs[]): RenderingAttrs {
    return rendering.reduce((res, r) => ({ ...res, ...r }), {});
}

// TODO: move to model utils
function spanText(span: Span): string {
    if (isSimple(span)) {
        return span;
    } else if (isAttributed(span)) {
        return spanText(span.content);
    } else if (isCompound(span)) {
        return span.spans
            .map(spanText)
            .join();
    } else if (isFootnote(span)) {
        return spanText(span.content);
    }

    return assertNever(span);
}

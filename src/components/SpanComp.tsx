import * as React from 'react';
import {
    Color, Theme, colors, fontSize, spanText,
} from '../model';
import {
    RichTextStyle, RichText,
} from '../blocks';
import {
    assertNever, filterUndefined,
    TaggedRange, range, Range, Callback,
} from '../utils';
import { RefPathHandler, pathToId } from './common';
import {
    Span, spanAttrs,
    isSimpleSpan, isAttributedSpan, isCompoundSpan, isFootnoteSpan,
    BookRange, BookPath, pathLessThan, isSubpath, isSemanticSpan,
} from 'booka-common';

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
    theme: Theme,
    openFootnote: Callback<string>,
};
export function SpanComp(props: SpanProps) {
    const ranges = rangesForProps(props);
    const fullText = spanText(props.span);
    return <RichText
        text={fullText}
        styles={ranges}
    />;
}

type RenderingRange = TaggedRange<RichTextStyle, number>;
function rangesForProps(props: SpanProps): RenderingRange[] {
    const spanRanges = rangesForSpan(props.span, props);
    const dropCaseRanges = props.first
        ? [{
            range: range(0, 1),
            tag: { dropCaps: true },
        }]
        : [];

    const absoluteRanges = ((props.colorization && props.colorization.ranges) || []);
    const colorizationRanges = filterUndefined(
        absoluteRanges
            .map(cr => {
                const relative = rangeRelativeToPath(props.path, cr.range);
                return relative
                    ? {
                        tag: { background: cr.color },
                        range: relative,
                    }
                    : undefined;
            })
    );

    const defaultStyles: RenderingRange[] = [{
        range: range(0),
        tag: {
            fontSize: fontSize(props.theme, 'text'),
            fontFamily: props.theme.fontFamilies.book,
            color: colors(props.theme).text,
        },
    }];

    const allRanges = ([] as RenderingRange[])
        .concat(defaultStyles)
        .concat(spanRanges)
        .concat(dropCaseRanges)
        .concat(colorizationRanges)
        ;
    const augmented = allRanges.map(r => {
        const path = props.path.concat(r.range.start);

        return {
            range: r.range,
            tag: {
                ...r.tag,
                id: pathToId(path),
                refHandler: (ref: any) => props.refPathHandler(ref, path),
            },
        };
    });

    return augmented;
}

function rangesForSpan(span: Span, props: SpanProps): RenderingRange[] {
    const result = rangesForSpanHelper(span, 0, props);
    return result.ranges;
}

function rangesForSpanHelper(span: Span, offset: number, props: SpanProps): {
    ranges: RenderingRange[],
    length: number,
} {
    if (isSimpleSpan(span)) {
        return {
            ranges: [{
                range: {
                    start: offset,
                    end: offset + span.length,
                },
                tag: undefined,
            }],
            length: span.length,
        };
    } else if (isAttributedSpan(span)) {
        const inside = rangesForSpanHelper(span.content, offset, props);
        const current: RenderingRange = {
            range: {
                start: offset,
                end: offset + inside.length,
            },
            tag: {
                italic: spanAttrs(span).italic,
                bold: spanAttrs(span).bold,
                line: spanAttrs(span).line,
            },
        };
        return {
            ranges: [current].concat(inside.ranges),
            length: inside.length,
        };
    } else if (isCompoundSpan(span)) {
        let ranges: RenderingRange[] = [];
        let currentOffset = offset;
        for (const s of span.spans) {
            const rs = rangesForSpanHelper(s, currentOffset, props);
            ranges = ranges.concat(rs.ranges);
            currentOffset += rs.length;
        }

        return {
            ranges,
            length: currentOffset - offset,
        };
    } else if (isFootnoteSpan(span)) {
        const inside = rangesForSpanHelper(span.content, offset, props);
        const current: RenderingRange = {
            range: {
                start: offset,
                end: offset + inside.length,
            },
            tag: {
                superLink: {
                    onClick: () => props.openFootnote(span.id),
                },
                color: colors(props.theme).accent,
                hoverColor: colors(props.theme).highlight,
            },
        };
        return {
            ranges: inside.ranges.concat(current),
            length: inside.length,
        };
    } else if (isSemanticSpan(span)) {
        // TODO: support
        return { ranges: [], length: 0 };
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
    if (isSubpath(path, bookR.start)) {
        start = bookR.start[path.length];
    }
    let end: number | undefined;
    if (bookR.end && isSubpath(path, bookR.end)) {
        end = bookR.end[path.length];
    }

    return start !== undefined
        ? range(start, end)
        : undefined;
}

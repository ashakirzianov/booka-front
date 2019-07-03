import * as React from 'react';

import {
    Color, BookRange, BookPath, isSimple, Span,
    isCompound, isAttributed, isFootnote, AttributesObject,
    SimpleSpan, CompoundSpan, spanLength, AttributedSpan,
    attrs, FootnoteSpan, inRange, bookRange, incrementPath,
    overlapWith, overlaps, sameParent, pathLessThan,
} from '../model';
import {
    Comp, PlainText, connectActions, ThemedText,
    ActionLink, Hoverable, Props, point,
} from '../blocks';
import { assertNever, filterUndefined, last } from '../utils';
import { actionCreators } from '../core';
import { RefPathHandler, pathToId } from './common';

type SpanType<T> = {
    span: T,
    path: BookPath,
    first: boolean,
    refPathHandler: RefPathHandler,
    colorization?: Colorization,
};

export type ColorizedRange = {
    color: Color,
    range: BookRange,
};
export type Colorization = {
    ranges: ColorizedRange[],
};

type SpanProps = SpanType<Span>;
export const SpanComp: Comp<SpanProps> = (props =>
    isSimple(props.span) ? <SimpleSpanComp {...props} span={props.span} />
        : isCompound(props.span) ? <CompoundSpanComp {...props} span={props.span} />
            : isAttributed(props.span) ? <AttributedSpanComp {...props} span={props.span} />
                : isFootnote(props.span) ? <FootnoteSpanComp {...props} span={props.span} />
                    : assertNever(props.span)
);

const StyledWithAttributes: Comp<{ attrs: AttributesObject }> = (props =>
    <PlainText style={{
        fontStyle: props.attrs.italic ? 'italic' : 'normal',
        fontWeight: props.attrs.bold ? 'bold' : 'normal',
        ...(props.attrs.line && {
            textIndent: point(2),
            display: 'block',
        }),
    }}>
        {props.children}
    </PlainText>
);

type SimpleSpanProps = {
    span: SimpleSpan,
    first: boolean,
    path: BookPath,
    refPathHandler: RefPathHandler,
    colorization?: Colorization,
};
const SimpleSpanComp: Comp<SimpleSpanProps> = (props => {
    return props.first
        ? <CapitalizeFirst text={props.span} path={props.path} colorization={props.colorization} refPathHandler={props.refPathHandler} />
        : <TextRun text={props.span} path={props.path} colorization={props.colorization} refPathHandler={props.refPathHandler} />;
});
function CompoundSpanComp({ span, path, first, colorization, refPathHandler }: SpanType<CompoundSpan>) {
    const children: JSX.Element[] = [];
    let offset = 0;
    let idx = 0;
    for (const childS of span.spans) {
        const pathCopy = path.slice();
        pathCopy[path.length - 1] += offset;
        const child = <SpanComp
            key={`${idx}`}
            span={childS}
            first={first && idx === 0}
            path={pathCopy}
            colorization={colorization}
            refPathHandler={refPathHandler}
        />;
        children.push(child);
        offset += spanLength(childS);
        idx++;
    }

    return <PlainText>{children}</PlainText>;
}
type AttributedSpanProps = SpanType<AttributedSpan>;
const AttributedSpanComp: Comp<AttributedSpanProps> = (props =>
    <StyledWithAttributes attrs={attrs(props.span)}>
        <SpanComp {...props} span={props.span.content} />
    </StyledWithAttributes>
);
type FootnoteSpanProps = SpanType<FootnoteSpan>;
const FootnoteSpanComp = connectActions('openFootnote')<FootnoteSpanProps>(function FootnoteSpanC(props: Props<FootnoteSpanProps>) {
    return <ActionLink action={actionCreators.openFootnote(props.span.id)}>
        <Hoverable>
            <ThemedText color='accent' hoverColor='highlight'>
                <SpanComp {...props} span={props.span.content} />
            </ThemedText>
        </Hoverable>
    </ActionLink>;
});

type TextRunProps = {
    text: string,
    path: BookPath,
    refPathHandler: RefPathHandler,
    colorization?: Colorization,
};
const CapitalizeFirst: Comp<TextRunProps> = (props => {
    const text = props.text.trimStart();
    const firstPath = props.path;
    const firstHighlight = colorsForPath(firstPath, props.colorization)[0];
    const secondPath = props.path.slice();
    secondPath[secondPath.length - 1] += 1;
    return <PlainText>
        <PlainText
            refHandler={ref => props.refPathHandler(ref, firstPath)}
            id={pathToId(firstPath)}
            dropCaps={true}
            background={firstHighlight}
        >
            {text[0]}
        </PlainText>
        <TextRun {...props} path={secondPath} text={text.slice(1)} />
    </PlainText>;
});

const TextRun: Comp<TextRunProps> = (props => {
    const spans = buildColorizedSpans(props.text, props.path, props.colorization);
    const children = spans.map(
        (s, idx) => !s ? null :
            <PlainText
                key={idx}
                id={pathToId(s.path)}
                refHandler={ref => props.refPathHandler(ref, s.path)}
                background={s.color}
            >
                {s.text}
            </PlainText>
    );

    return <PlainText>
        {children}
    </PlainText>;
});

type StyledSpan = {
    text: string,
    color?: Color,
    path: BookPath,
};

function colorsForPath(path: BookPath, colorization?: Colorization) {
    if (!colorization) {
        return [];
    }

    const colors = colorization.ranges.map(cr =>
        inRange(path, cr.range) ? cr.color : undefined);

    return filterUndefined(colors);
}

function buildColorizedSpans(text: string, path: BookPath, colorization?: Colorization): StyledSpan[] {
    if (!colorization || colorization.ranges.length < 1) {
        return [{ text, path }];
    }

    const spanRange = bookRange(path, incrementPath(path, text.length));
    const relevant = overlapWith(spanRange, colorization.ranges.map(cr => ({
        tag: cr.color,
        range: cr.range,
    })));
    relevant.push({ range: spanRange });

    const os = overlaps(relevant);

    const result = os.map(tagged => {
        const spanText = subsForRange(text, path, tagged.range);
        return !spanText ? undefined : {
            text: spanText,
            color: tagged.tags.length > 0
                ? tagged.tags[0]
                : undefined,
            path: tagged.range.start,
        };
    });

    return filterUndefined(result);
}

function subsForRange(s: string, path: BookPath, r: BookRange): string | undefined {
    let from = 0;
    if (sameParent(r.start, path)) {
        from = last(r.start) - last(path);
    } else if (!pathLessThan(r.start, path)) {
        return undefined;
    }

    if (!r.end) {
        return s.substring(from);
    }

    if (sameParent(path, r.end)) {
        const to = last(r.end) - last(path);
        return s.substring(from, to);
    } else if (pathLessThan(path, r.end)) {
        return s.substring(from);
    } else {
        return undefined;
    }
}

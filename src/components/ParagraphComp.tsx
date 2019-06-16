import * as React from 'react';
import {
    Comp, relative, PlainText,
    connectActions, TextLink, ThemedText, themed, highlights, named,
} from '../blocks';
import { assertNever } from '../utils';
import {
    isSimple, isAttributed, isFootnote, ParagraphNode,
    BookPath, AttributesObject, SimpleSpan, AttributedSpan,
    attrs, spanLength, FootnoteSpan, Span, BookRange, Color, Highlights, CompoundSpan, isCompound,
} from '../model';
import { actionCreators } from '../redux';
import { TextRun, CapitalizeFirst, ParagraphContainer } from './ParagraphComp.platform';
import { parsePath, pathToString, RefPathHandler } from './bookRender';

type SpanTypeBase = {
    path: BookPath,
    first: boolean,
    refPathHandler: RefPathHandler,
};
type SpanType<T> = SpanTypeBase & {
    span: T,
    colorization?: Colorization,
};

export type ColorizedRange = {
    color: Color,
    range: BookRange,
};
export type Colorization = {
    ranges: ColorizedRange[],
};

export type ParagraphProps = SpanTypeBase & {
    p: ParagraphNode,
    highlights?: Highlights,
};
export const ParagraphComp = named(
    themed<ParagraphProps>(props =>
        <ParagraphContainer textIndent={relative(props.first ? 0 : 2)}>
            <SpanComp
                {...props}
                path={props.path.concat([0])}
                span={props.p.span}
                colorization={props.highlights && props.highlights.quote && {
                    ranges: [{
                        color: highlights(props).quote,
                        range: props.highlights.quote,
                    }],
                }}
            />
        </ParagraphContainer>
    ),
    'ParagraphComp'
);

const StyledWithAttributes: Comp<{ attrs: AttributesObject }> = (props =>
    <PlainText style={{
        fontStyle: props.attrs.italic ? 'italic' : 'normal',
        fontWeight: props.attrs.bold ? 'bold' : 'normal',
        ...(props.attrs.line && {
            textIndent: relative(2),
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
const CompoundSpanComp: Comp<SpanType<CompoundSpan>> = (props =>
    <>
        {
            props.span.spans.reduce(
                (result, childS, idx) => {
                    const path = props.path.slice();
                    path[path.length - 1] += result.offset;
                    const child = <SpanComp
                        key={`${idx}`}
                        span={childS}
                        first={props.first && idx === 0}
                        path={path}
                        colorization={props.colorization}
                        refPathHandler={props.refPathHandler}
                    />;
                    result.children.push(child);
                    result.offset += spanLength(childS);
                    return result;
                },
                {
                    children: [] as JSX.Element[],
                    offset: 0,
                }
            ).children
        }
    </>
);
type AttributedSpanProps = SpanType<AttributedSpan>;
const AttributedSpanComp: Comp<AttributedSpanProps> = (props =>
    <StyledWithAttributes attrs={attrs(props.span)}>
        <SpanComp {...props} span={props.span.content} />
    </StyledWithAttributes>
);
type FootnoteSpanProps = SpanType<FootnoteSpan>;
const FootnoteSpanComp = connectActions('openFootnote')<FootnoteSpanProps>(props =>
    <TextLink action={actionCreators.openFootnote(props.span.id)}>
        <ThemedText color='accent' hoverColor='highlight'>
            <SpanComp {...props} span={props.span.content} />
        </ThemedText>
    </TextLink>
);
type SpanProps = SpanType<Span>;
const SpanComp: Comp<SpanProps> = (props =>
    isSimple(props.span) ? <SimpleSpanComp {...props} span={props.span} />
        : isCompound(props.span) ? <CompoundSpanComp {...props} span={props.span} />
            : isAttributed(props.span) ? <AttributedSpanComp {...props} span={props.span} />
                : isFootnote(props.span) ? <FootnoteSpanComp {...props} span={props.span} />
                    : assertNever(props.span)
);

// TODO: rethink this solution

export function pathToId(path: BookPath): string {
    return `id:${pathToString(path)}`;
}

export function idToPath(str: string): BookPath | undefined {
    const comps = str.split(':');
    if (comps.length !== 2 || comps[0] !== 'id') {
        return undefined;
    }
    const path = parsePath(comps[1]);

    return path;
}

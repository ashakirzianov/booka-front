import * as React from 'react';

import { Color, BookRange, BookPath, isSimple, Span, isCompound, isAttributed, isFootnote, AttributesObject, SimpleSpan, CompoundSpan, spanLength, AttributedSpan, attrs, FootnoteSpan } from '../model';
import { RefPathHandler } from './bookRender';
import { Comp, PlainText, relative, connectActions, TextLink, ThemedText } from '../blocks';
import { assertNever } from '../utils';
import { TextRun, CapitalizeFirst } from './ParagraphComp.platform';
import { actionCreators } from '../core';

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

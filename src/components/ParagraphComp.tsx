import * as React from 'react';
import {
    Comp, relative, PlainText,
    connectActions, Link, ThemedText,
} from '../blocks';
import { assertNever } from '../utils';
import {
    isSimple, isAttributed, isFootnote, ParagraphNode,
    BookPath, AttributesObject, SimpleSpan, AttributedSpan,
    attrs, spanLength, FootnoteSpan, Span, BookRange, Color,
} from '../model';
import { actionCreators } from '../redux';
import { TextRun, CapitalizeFirst, ParagraphContainer } from './ParagraphComp.platform';
import { parsePath, pathToString, RefPathHandler } from './bookRender';

type SpanType<T> = {
    span: T,
    path: BookPath,
    first: boolean,
    refPathHandler: RefPathHandler,
    highlight?: HighlightData,
};

export type Highlight = {
    color: Color,
    range: BookRange,
};
export type HighlightData = {
    quote?: Highlight,
};
export type ParagraphProps = SpanType<ParagraphNode>;
export const ParagraphComp: Comp<ParagraphProps> = (props =>
    <ParagraphContainer textIndent={relative(props.first ? 0 : 2)}>
        <SpanComp
            {...props}
            path={props.path.concat([0])}
            span={props.span.span}
        />
    </ParagraphContainer>
);

const StyledWithAttributes: Comp<{ attrs: AttributesObject }> = (props =>
    <PlainText style={{
        fontStyle: props.attrs.italic ? 'italic' : 'normal',
        ...(props.attrs.line && {
            textIndent: relative(2),
            display: 'block',
        }),
    }}>
        {props.children}
    </PlainText>
);

type SimpleSpanProps = {
    s: SimpleSpan,
    first: boolean,
    path: BookPath,
    refPathHandler: RefPathHandler,
    highlight?: HighlightData,
};
const SimpleSpanComp: Comp<SimpleSpanProps> = (props => {
    return props.first
        ? <CapitalizeFirst text={props.s} path={props.path} highlight={props.highlight} refPathHandler={props.refPathHandler} />
        : <TextRun text={props.s} path={props.path} highlight={props.highlight} refPathHandler={props.refPathHandler} />;
});
type AttributedSpanProps = SpanType<AttributedSpan>;
const AttributedSpanComp: Comp<AttributedSpanProps> = (props =>
    <StyledWithAttributes attrs={attrs(props.span)}>
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
                        highlight={props.highlight}
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
    </StyledWithAttributes>
);
type FootnoteSpanProps = SpanType<FootnoteSpan>;
const FootnoteSpanComp = connectActions('openFootnote')<FootnoteSpanProps>(props =>
    <Link action={actionCreators.openFootnote(props.span.id)}>
        <ThemedText color='accent' hoverColor='highlight'>
            <TextRun text={props.span.text || ''} path={props.path} highlight={props.highlight} refPathHandler={props.refPathHandler} />
        </ThemedText>
    </Link>
);
type SpanProps = SpanType<Span>;
const SpanComp: Comp<SpanProps> = (props =>
    isSimple(props.span) ? <SimpleSpanComp {...props} s={props.span} />
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

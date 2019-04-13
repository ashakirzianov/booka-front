import * as React from 'react';
import {
    Comp, refable, relative, PlainText,
    connectActions, Link, ThemedText,
} from '../blocks';
import { assertNever } from '../utils';
import {
    isSimple, isAttributed, isFootnote, ParagraphNode,
    BookPath, AttributesObject, SimpleSpan, AttributedSpan,
    attrs, spanLength, FootnoteSpan, Span,
} from '../model';
import { actionCreators } from '../redux';
import { TextRun, CapitalizeFirst, ParagraphContainer } from './ParagraphComp.platform';
import { parsePath, pathToString } from './bookRender';

export const ParagraphComp = refable<{ p: ParagraphNode, path: BookPath, first: boolean }>(props =>
    <ParagraphContainer textIndent={relative(props.first ? 0 : 2)}>
        <SpanComp
            s={props.p.span}
            first={props.first}
            path={props.path.concat(0)}
        />
    </ParagraphContainer>,
    'ParagraphComp'
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
};
const SimpleSpanComp: Comp<SimpleSpanProps> = (props => {
    const info = {
        path: props.path,
    };
    return props.first
        ? <CapitalizeFirst text={props.s} info={info} />
        : <TextRun text={props.s} info={info} />;
});
type AttributedSpanProps = {
    s: AttributedSpan,
    first: boolean,
    path: BookPath,
};
const AttributedSpanComp: Comp<AttributedSpanProps> = (props =>
    <StyledWithAttributes attrs={attrs(props.s)}>
        {
            props.s.spans.reduce(
                (result, childS, idx) => {
                    const path = props.path.slice();
                    path[path.length - 1] += result.offset;
                    const child = <SpanComp
                        key={`${idx}`}
                        s={childS}
                        first={props.first && idx === 0}
                        path={path}
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
type FootnoteSpanProps = {
    s: FootnoteSpan,
    path: BookPath,
};
const FootnoteSpanComp = connectActions('openFootnote')<FootnoteSpanProps>(props =>
    <Link action={actionCreators.openFootnote(props.s.id)}>
        <ThemedText color='accent' hoverColor='highlight'>
            <TextRun text={props.s.text || ''} info={{ path: props.path }} />
        </ThemedText>
    </Link>
);
type SpanProps = {
    s: Span,
    first: boolean,
    path: BookPath,
};
const SpanComp: Comp<SpanProps> = (props =>
    isSimple(props.s) ? <SimpleSpanComp
        s={props.s} first={props.first} path={props.path} />
        : isAttributed(props.s) ? <AttributedSpanComp
            s={props.s} first={props.first} path={props.path} />
            : isFootnote(props.s) ? <FootnoteSpanComp
                s={props.s} path={props.path} />
                : assertNever(props.s)
);

// TODO: rethink this solution
export type SpanInfo = {
    path: BookPath,
};

export function infoToId(id: SpanInfo): string {
    return `id:${pathToString(id.path)}`;
}

export function idToInfo(str: string): SpanInfo | undefined {
    const comps = str.split(':');
    if (comps.length !== 2 || comps[0] !== 'id') {
        return undefined;
    }
    const path = parsePath(comps[1]);

    return path
        ? { path }
        : undefined;
}

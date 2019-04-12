import * as React from 'react';
import {
    Span, BookPath, ChapterNode, BookId, bookLocator, BookRange,
    BookNode, isParagraph, isChapter, inRange, BookContent,
    subpathCouldBeInRange, AttributesObject, SimpleSpan,
    AttributedSpan, attrs, isAttributed, isSimple, ParagraphNode,
    isFootnote, FootnoteSpan, bookRange, locationPath, spanLength,
} from '../model';
import { assertNever, last } from '../utils';
import {
    Comp, Callback, relative, connectActions,
    Row, Pph, ThemedText,
    ScrollView, refable, RefType, isPartiallyVisible, scrollToRef, LinkButton, Link, PlainText,
} from '../blocks';
import { actionCreators } from '../redux';
import { CapitalizeFirst, TextRun, getSelectionRange, subscribeScroll, subscribeSelection, unsubscribeScroll, unsubscribeSelection } from './BookContentComp.platform';

type RefMap = { [k in string]?: RefType };
type BookContentCompProps = {
    content: BookContent,
    pathToNavigate: BookPath | null,
    updateBookPosition: Callback<BookPath>,
    range: BookRange,
    prevPath?: BookPath,
    nextPath?: BookPath,
    id: BookId,
};
export class BookContentComp extends React.Component<BookContentCompProps> {
    public refMap: RefMap = {};

    public handleScroll = () => {
        const newCurrentPath = Object.entries(this.refMap)
            .reduce<BookPath | undefined>((path, [key, ref]) =>
                path || !isPartiallyVisible(ref)
                    ? path
                    : stringToPath(key), undefined);
        if (newCurrentPath) {
            this.props.updateBookPosition(newCurrentPath);
        }
    }

    public handleSelection = () => {
        const range = getSelectionRange();
        if (range) {
            // tslint:disable-next-line:no-console
            console.log(range);
        }
    }

    public scrollToCurrentPath = () => {
        const props = this.props;
        const refMap = this.refMap;
        if (props && props.pathToNavigate) {
            const refToNavigate = refMap[pathToString(props.pathToNavigate)];
            if (!scrollToRef(refToNavigate)) {
                setTimeout(this.scrollToCurrentPath.bind(this), 250);
            }
        }
    }

    public componentDidMount() {
        subscribeScroll(this.handleScroll);
        subscribeSelection(this.handleSelection);
        this.scrollToCurrentPath();

    }

    public componentDidUpdate() {
        this.scrollToCurrentPath();
    }

    public componentWillUnmount() {
        unsubscribeScroll(this.handleScroll);
        unsubscribeSelection(this.handleSelection);
    }

    public render() {
        const { range, prevPath, nextPath, id, content } = this.props;
        const params: Params = {
            range,
            refHandler: (ref, path) => {
                this.refMap = {
                    ...this.refMap,
                    [pathToString(path)]: ref,
                };
            },
        };
        return <ScrollView>
            {prevPath && <PathLink path={prevPath} id={id} text='Previous' />}
            <ThemedText style={{
                textAlign: 'justify',
            }}>
                {buildBook(content, params)}
            </ThemedText>
            {nextPath && <PathLink path={nextPath} id={id} text='Next' />}
        </ScrollView>;
    }
}

export const BookNodesComp: Comp<{ nodes: BookNode[] }> = (props =>
    <ThemedText>
        {
            buildNodes(props.nodes, [], {
                refHandler: () => undefined,
                range: bookRange(),
            })
        }
    </ThemedText>
);

const ChapterTitle: Comp<{ text?: string }> = (props =>
    <Row style={{
        justifyContent: 'center',
        width: '100%',
    }}>
        <ThemedText style={{
            letterSpacing: relative(0.15),
            textAlign: 'center',
            margin: relative(1),
        }}>
            {props.text && props.text.toLocaleUpperCase()}
        </ThemedText>
    </Row>
);

const PartTitle: Comp<{ text?: string }> = (props =>
    <Row style={{
        justifyContent: 'center',
        width: '100%',
    }}>
        <ThemedText size='large' style={{
            fontWeight: 'bold',
            textAlign: 'center',
            margin: relative(1),
        }}>
            {props.text}
        </ThemedText>
    </Row>
);

const SubpartTitle: Comp<{ text?: string }> = (props =>
    <Row style={{ justifyContent: 'flex-start' }}>
        <ThemedText style={{
            fontStyle: 'italic',
            margin: relative(1),
        }}>
            {props.text}
        </ThemedText>
    </Row>
);

const BookTitle: Comp<{ text?: string }> = (props =>
    <Row style={{ justifyContent: 'center', width: '100%' }}>
        <ThemedText size='largest' style={{
            fontWeight: 'bold',
            textAlign: 'center',
        }}>
            {props.text}
        </ThemedText>
    </Row>
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
                    const path = props.path.concat([result.offset]);
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

const ParagraphComp = refable<{ p: ParagraphNode, path: BookPath, first: boolean }>(props =>
    <Pph textIndent={relative(props.first ? 0 : 2)}>
        <SpanComp
            s={props.p.span}
            first={props.first}
            path={props.path}
        />
    </Pph>,
    'ParagraphComp'
);

const ChapterHeader = refable<ChapterNode & { path: BookPath }>(props =>
    props.level === 0 ? <ChapterTitle text={props.title} />
        : props.level > 0 ? <PartTitle text={props.title} />
            : <SubpartTitle text={props.title} />,
    'ChapterHeader'
);

type PathLinkProps = {
    path: BookPath,
    id: BookId,
    text: string,
};
const PathLink: Comp<PathLinkProps> = (props =>
    <Row style={{
        justifyContent: 'center',
        margin: relative(2),
    }}>
        <LinkButton action={actionCreators
            .navigateToBook(bookLocator(props.id, locationPath(props.path)))}
        >
            {props.text}
        </LinkButton>
    </Row>
);

type Params = {
    refHandler: (ref: RefType, path: BookPath) => void,
    range: BookRange,
};

function buildBook(book: BookContent, params: Params) {
    const head = params.range.start.length === 0
        ? [<BookTitle key={`bt`} text={book.meta.title} />]
        : [];

    return head
        .concat(buildNodes(book.nodes, [], params));
}

function buildNodes(nodes: BookNode[], headPath: BookPath, params: Params): JSX.Element[] {
    return nodes
        .map((bn, i) => buildNode(bn, headPath.concat([i]), params))
        .reduce((acc, arr) => acc.concat(arr))
        ;
}

function buildNode(node: BookNode, path: BookPath, params: Params) {
    if (!subpathCouldBeInRange(path, params.range)) {
        return [];
    }

    if (isParagraph(node)) {
        return buildParagraph(node, path, params);
    } else if (isChapter(node)) {
        return buildChapter(node, path, params);
    } else {
        return assertNever(node, path.toString());
    }
}

function buildParagraph(paragraph: ParagraphNode, path: BookPath, params: Params) {
    return inRange(path, params.range)
        ? [<ParagraphComp
            key={`p-${pathToString(path)}`}
            p={paragraph}
            path={path}
            first={last(path) === 0}
            ref={ref => params.refHandler(ref, path)}
        />]
        : [];
}

function buildChapter(chapter: ChapterNode, path: BookPath, params: Params) {
    const head = inRange(path, params.range)
        ? [<ChapterHeader ref={ref => params.refHandler(ref, path)} key={`ch-${pathToString(path)}`} path={path} {...chapter} />]
        : [];
    return head
        .concat(buildNodes(chapter.nodes, path, params));
}

export function pathToString(path: BookPath): string {
    return path.join('-');
}

export function stringToPath(str: string): BookPath {
    const path = str.split('-')
        .map(p => parseInt(p, 10));

    return path;
}

export type SpanInfo = {
    path: BookPath,
};


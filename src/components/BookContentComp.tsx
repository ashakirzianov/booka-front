import * as React from 'react';
import {
    Span, BookPath, ChapterNode, BookId, bookLocator, BookRange,
    BookNode, isParagraph, isChapter, inRange, BookContent,
    subpathCouldBeInRange, AttributesObject, SimpleSpan,
    AttributedSpan, attrs, isAttributed, isSimple, ParagraphNode,
    isFootnote, FootnoteSpan, bookRange, locationPath,
} from '../model';
import { assertNever } from '../utils';
import {
    comp, Callback, relative, connectActions,
    Row, NewLine, Tab, Inline, ThemedText,
    ScrollView, IncrementalLoad, refable, RefType, isPartiallyVisible, scrollToRef, LinkButton, Link, PlainText,
} from '../blocks';
import { actionCreators } from '../redux/actions';

const ChapterTitle = comp<{ text?: string }>(props =>
    <Row style={{ justifyContent: 'center' }}>
        <ThemedText>{props.text}</ThemedText>
    </Row>,
);

const PartTitle = comp<{ text?: string }>(props =>
    <Row style={{ justifyContent: 'center' }}>
        <ThemedText style={{ fontWeight: 'bold' }} size='large'>{props.text}</ThemedText>
    </Row>,
);

const SubpartTitle = comp<{ text?: string }>(props =>
    <Row style={{ justifyContent: 'flex-start' }}>
        <ThemedText style={{ fontWeight: 'bold' }}>{props.text}</ThemedText>
    </Row>,
);

const BookTitle = comp<{ text?: string }>(props =>
    <Row style={{ justifyContent: 'center', width: '100%' }}>
        <ThemedText style={{ fontWeight: 'bold' }} size='largest'>{props.text}</ThemedText>
    </Row>,
);

const StyledWithAttributes = comp<{ attrs: AttributesObject }>(props =>
    <PlainText style={{
        fontStyle: props.attrs.italic ? 'italic' : 'normal',
    }}>
        {props.children}
        {
            props.attrs.line
                ? [<NewLine key='nl' />, <Tab key='tab' />]
                : null
        }
    </PlainText>,
);

const SimpleSpanComp = comp<{ s: SimpleSpan }>(props =>
    <PlainText>{props.s}</PlainText>,
);
const AttributedSpanComp = comp<{ s: AttributedSpan }>(props =>
    <StyledWithAttributes attrs={attrs(props.s)}>
        {
            props.s.spans.map((childP, idx) =>
                <SpanComp key={`${idx}`} span={childP} />)
        }
    </StyledWithAttributes>,
);
const FootnoteSpanComp = connectActions('openFootnote')<{ s: FootnoteSpan }>(props =>
    <Link action={actionCreators.openFootnote(props.s.id)}>
        <ThemedText color='accent' hoverColor='highlight'>
            {props.s.text}
        </ThemedText>
    </Link>,
);
const SpanComp = comp<{ span: Span }>(props =>
    isAttributed(props.span) ? <AttributedSpanComp s={props.span} />
        : isSimple(props.span) ? <SimpleSpanComp s={props.span} />
            : isFootnote(props.span) ? <FootnoteSpanComp s={props.span} />
                : assertNever(props.span),
);

const ParagraphComp = refable<{ p: ParagraphNode, path: BookPath }>(props =>
    <Inline>
        <Tab /><SpanComp span={props.p.span} />
    </Inline>,
);

const ChapterHeader = refable<ChapterNode & { path: BookPath }>(props =>
    props.level === 0 ? <ChapterTitle text={props.title} />
        : props.level > 0 ? <PartTitle text={props.title} />
            : <SubpartTitle text={props.title} />,
);

const PathLink = comp<{ path: BookPath, id: BookId, text: string }>(props =>
    <Row style={{
        justifyContent: 'center',
        margin: relative(2),
    }}>
        <LinkButton action={actionCreators
            .navigateToBook(bookLocator(props.id, locationPath(props.path)))}
        >
            {props.text}
        </LinkButton>
    </Row>,
);

export const BookNodesComp = comp<{ nodes: BookNode[] }>(props =>
    <ThemedText>
        {
            buildNodes(props.nodes, [], {
                refHandler: () => undefined,
                range: bookRange(),
            })
        }
    </ThemedText>,
);

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
                path || !isPartiallyVisible(ref) ? path : stringToPath(key), undefined);
        if (newCurrentPath) {
            this.props.updateBookPosition(newCurrentPath);
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
        window.addEventListener('scroll', this.handleScroll);
        this.scrollToCurrentPath();
    }

    public componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    public render() {
        const { range, prevPath, nextPath, id, content } = this.props;
        const params: Params = {
            range, refHandler: (ref, path) => {
                this.refMap = {
                    ...this.refMap,
                    [pathToString(path)]: ref,
                };
            },
        };
        return <ScrollView>
            {prevPath && <PathLink path={prevPath} id={id} text='Previous' />}
            <ThemedText>
                <IncrementalLoad
                    increment={250}
                    initial={50}
                >
                    {buildBook(content, params)}
                </IncrementalLoad>
            </ThemedText>
            {nextPath && <PathLink path={nextPath} id={id} text='Next' />}
        </ScrollView>;
    }
}

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
        ? [<ParagraphComp key={`p-${pathToString(path)}`} p={paragraph} path={path} ref={ref => params.refHandler(ref, path)} />]
        : [];
}

function buildChapter(chapter: ChapterNode, path: BookPath, params: Params) {
    const head = inRange(path, params.range)
        ? [<ChapterHeader ref={ref => params.refHandler(ref, path)} key={`ch-${pathToString(path)}`} path={path} {...chapter} />]
        : [];
    return head
        .concat(buildNodes(chapter.nodes, path, params));
}

function pathToString(path: BookPath): string {
    return path.join('-');
}

function stringToPath(str: string): BookPath {
    const path = str.split('-')
        .map(p => parseInt(p, 10));

    return path;
}

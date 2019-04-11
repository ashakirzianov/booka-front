import * as React from 'react';
import {
    Span, BookPath, ChapterNode, BookId, bookLocator, BookRange,
    BookNode, isParagraph, isChapter, inRange, BookContent,
    subpathCouldBeInRange, AttributesObject, SimpleSpan,
    AttributedSpan, attrs, isAttributed, isSimple, ParagraphNode,
    isFootnote, FootnoteSpan, bookRange, locationPath,
} from '../model';
import { assertNever, last } from '../utils';
import {
    comp, Callback, relative, connectActions,
    Row, NewLine, Pph, ThemedText,
    ScrollView, refable, RefType, isPartiallyVisible, scrollToRef, LinkButton, Link, PlainText, CapitalizeFirst, TextRun,
} from '../blocks';
import { actionCreators } from '../redux/actions';

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

    public componentDidUpdate() {
        this.scrollToCurrentPath();
    }

    public componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
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

const ChapterTitle = comp<{ text?: string }>(props =>
    <Row style={{
        justifyContent: 'center',
        width: '100%',
    }}>
        <ThemedText style={{
            letterSpacing: relative(0.15),
            fontWeight: 'lighter',
            textAlign: 'center',
            margin: relative(1),
        }}>
            {props.text && props.text.toLocaleUpperCase()}
        </ThemedText>
    </Row>,
);

const PartTitle = comp<{ text?: string }>(props =>
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
    </Row>,
);

const SubpartTitle = comp<{ text?: string }>(props =>
    <Row style={{ justifyContent: 'flex-start' }}>
        <ThemedText style={{
            fontStyle: 'italic',
            margin: relative(1),
        }}>
            {props.text}
        </ThemedText>
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
                ? <NewLine key='nl' />
                : null
        }
    </PlainText>,
);

const SimpleSpanComp = comp<{ s: SimpleSpan, first: boolean }>(props =>
    props.first
        ? <CapitalizeFirst text={props.s} />
        : <TextRun text={props.s} />,
);
const AttributedSpanComp = comp<{ s: AttributedSpan, first: boolean }>(props =>
    <StyledWithAttributes attrs={attrs(props.s)}>
        {
            props.s.spans.map((childP, idx) =>
                <SpanComp key={`${idx}`} s={childP} first={props.first && idx === 0} />)
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
const SpanComp = comp<{ s: Span, first: boolean }>(props =>
    isSimple(props.s) ? <SimpleSpanComp s={props.s} first={props.first} />
        : isAttributed(props.s) ? <AttributedSpanComp s={props.s} first={props.first} />
            : isFootnote(props.s) ? <FootnoteSpanComp s={props.s} />
                : assertNever(props.s),
);

const ParagraphComp = refable<{ p: ParagraphNode, path: BookPath, first: boolean }>(props =>
    <Pph textIndent={relative(props.first ? 0 : 2)}>
        <SpanComp s={props.p.span} first={props.first} />
    </Pph>,
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

function pathToString(path: BookPath): string {
    return path.join('-');
}

function stringToPath(str: string): BookPath {
    const path = str.split('-')
        .map(p => parseInt(p, 10));

    return path;
}

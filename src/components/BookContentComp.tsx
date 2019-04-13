import * as React from 'react';
import {
    BookPath, ChapterNode, BookId, bookLocator, BookRange,
    BookNode, isParagraph, isChapter, inRange, BookContent,
    subpathCouldBeInRange, ParagraphNode, bookRange,
    locationPath, parentPath, pathToString, parsePath,
} from '../model';
import { assertNever, last } from '../utils';
import {
    Comp, Callback, relative, Row, ThemedText,
    ScrollView, refable, RefType, isPartiallyVisible,
    scrollToRef, LinkButton,
} from '../blocks';
import { actionCreators } from '../redux';
import {
    getSelectionRange, subscribeScroll, subscribeSelection,
    unsubscribeScroll, unsubscribeSelection, subscribeCopy,
    unsubscribeCopy,
} from './BookContentComp.platform';
import { generateQuoteLink } from '../core/urlConversion';
import { ParagraphComp } from './ParagraphComp';

export type BookSelection = {
    text: string,
    range: BookRange,
};

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
    public selectedRange: BookSelection | undefined = undefined;

    public handleScroll = () => {
        const newCurrentPath = Object.entries(this.refMap)
            .reduce<BookPath | undefined>((path, [key, ref]) =>
                path || !isPartiallyVisible(ref)
                    ? path
                    : parsePath(key), undefined);
        if (newCurrentPath) {
            this.props.updateBookPosition(newCurrentPath);
        }
    }

    public handleSelection = () => {
        this.selectedRange = getSelectionRange();
    }

    public handleCopy = (e: ClipboardEvent) => {
        if (this.selectedRange && e.clipboardData) {
            e.preventDefault();
            const selectionText = buildSelection(this.selectedRange, this.props.id);
            e.clipboardData.setData('text/plain', selectionText);
        }
    }

    public scrollToCurrentPath = () => {
        const props = this.props;
        const refMap = this.refMap;
        if (props && props.pathToNavigate) {
            const refToNavigate =
                refMap[pathToString(props.pathToNavigate)]
                // TODO: find better solution
                // In case we navigate to character
                || refMap[pathToString(parentPath(props.pathToNavigate))]
                ;
            if (!scrollToRef(refToNavigate)) {
                setTimeout(this.scrollToCurrentPath.bind(this), 250);
            }
        }
    }

    public componentDidMount() {
        subscribeScroll(this.handleScroll);
        subscribeSelection(this.handleSelection);
        subscribeCopy(this.handleCopy);
        this.scrollToCurrentPath();

    }

    public componentDidUpdate() {
        this.scrollToCurrentPath();
    }

    public componentWillUnmount() {
        unsubscribeScroll(this.handleScroll);
        unsubscribeSelection(this.handleSelection);
        unsubscribeCopy(this.handleCopy);
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

function buildSelection(selection: BookSelection, id: BookId) {
    return `${selection.text}\n${generateQuoteLink(id, selection.range)}`;
}

import * as React from 'react';
import { throttle } from 'lodash';
import {
    Book, BookNode, Chapter, Paragraph,
    isParagraph, LoadedBook, ErrorBook, isChapter, BookPath, BookRange, inRange, bookRange, BookContent, iterateToPath, bookIterator, OptBookIterator, nextIterator, buildPath, pathLessThan, emptyPath, BookId, bookLocator,
} from '../model';
import { assertNever } from '../utils';
import { Comp, connected, Callback } from './comp-utils';
import {
    ParagraphText, ActivityIndicator, StyledText, Row, Label,
    ScrollView,
    IncrementalLoad,
    LinkButton,
} from './Elements';
import { refable, RefType, scrollToRef, isPartiallyVisible } from './Scroll.platform';
import { TableOfContents } from '../model/tableOfContent';
import { linkForBook } from '../logic';

export const BookComp = connected(['positionToNavigate'], ['updateCurrentBookPosition'])<Book>(props => {
    switch (props.book) {
        case 'error':
            return <ErrorBookComp {...props} />;
        case 'book':
            const position = props.positionToNavigate || emptyPath();
            const paths = buildPaths(position, props.toc);
            return <ActualBookComp
                pathToNavigate={props.positionToNavigate}
                updateCurrentBookPosition={props.updateCurrentBookPosition}
                range={bookRange(paths.current, paths.next)}
                prevPath={paths.prev}
                nextPath={paths.next}
                {...props} />;
        case 'loading':
            return <ActivityIndicator />;
        default:
            return assertNever(props);
    }
});

const ErrorBookComp: Comp<ErrorBook> = props =>
    <Label text={'Error: ' + props.error} />;

const ChapterTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'center' }}>
        <StyledText>{props.text}</StyledText>
    </Row>;

const PartTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'center' }}>
        <StyledText style={{ fontWeight: 'bold', fontSize: 30 }}>{props.text}</StyledText>
    </Row>;

const SubpartTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'flex-start' }}>
        <StyledText style={{ fontWeight: 'bold' }}>{props.text}</StyledText>
    </Row>;

const BookTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'center', width: '100%' }}>
        <StyledText style={{ fontWeight: 'bold', fontSize: 36 }}>{props.text}</StyledText>
    </Row>;

const ParagraphComp = refable<{ p: Paragraph, path: BookPath }>(props =>
    <ParagraphText text={props.p} />,
);

const ChapterHeader = refable<Chapter & { path: BookPath }>(props =>
    props.level === 0 ? <ChapterTitle text={props.title} />
        : props.level > 0 ? <PartTitle text={props.title} />
            : <SubpartTitle text={props.title} />,
);

const PathLink: Comp<{ path: BookPath, id: BookId, text: string }> = (props =>
    <LinkButton link={linkForBook(bookLocator(props.id, props.path))}>
        <Label text={props.text} />
    </LinkButton>
);

type RefMap = { [k in string]?: RefType };
type ActualBookCompProps = LoadedBook & {
    pathToNavigate: BookPath | null,
    updateCurrentBookPosition: Callback<BookPath>,
    range: BookRange,
    prevPath?: BookPath,
    nextPath?: BookPath,
    id: BookId,
};
class ActualBookComp extends React.Component<ActualBookCompProps> {
    public refMap: RefMap = {};

    public handleScroll = throttle(() => {
        const newCurrentPath = Object.entries(this.refMap)
            .reduce<BookPath | undefined>((path, [key, ref]) =>
                path || !isPartiallyVisible(ref) ? path : stringToPath(key), undefined);
        if (newCurrentPath) {
            this.props.updateCurrentBookPosition(newCurrentPath);
        }
    }, 250);

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
        const props = this.props;
        return <ScrollView>
            {props.prevPath && <PathLink path={props.prevPath} id={props.id} text='Previous chapter' />}
            <IncrementalLoad
                increment={250}
                initial={50}
            >
                {buildBook(props, props.range, (ref, path) => {
                    this.refMap = {
                        ...this.refMap,
                        [pathToString(path)]: ref,
                    };
                })}
            </IncrementalLoad>
            {props.nextPath && <PathLink path={props.nextPath} id={props.id} text='Next chapter' />}
        </ScrollView>;
    }
}

type NodeRefHandler = (ref: RefType, path: BookPath) => void;
function buildNodes(nodes: BookNode[], range: BookRange, headPath: BookPath, refHandler: NodeRefHandler): JSX.Element[] {
    return nodes
        .map((bn, i) => buildNode(bn, range, headPath.concat([i]), refHandler))
        .reduce((acc, arr) => acc.concat(arr))
        ;
}

function buildNode(node: BookNode, range: BookRange, path: BookPath, refHandler: NodeRefHandler) {
    if (!subpathCouldBeInRange(path, range)) {
        return [];
    }

    if (isParagraph(node)) {
        return buildParagraph(node, range, path, refHandler);
    } else if (isChapter(node)) {
        return buildChapter(node, range, path, refHandler);
    } else {
        return assertNever(node, path.toString());
    }
}

function buildParagraph(paragraph: Paragraph, range: BookRange, path: BookPath, refHandler: NodeRefHandler) {
    return inRange(path, range)
        ? [<ParagraphComp key={`p-${pathToString(path)}`} p={paragraph} path={path} ref={ref => refHandler(ref, path)} />]
        : [];
}

function buildChapter(chapter: Chapter, range: BookRange, path: BookPath, refHandler: NodeRefHandler) {
    const head = inRange(path, range)
        ? [<ChapterHeader ref={ref => refHandler(ref, path)} key={`ch-${pathToString(path)}`} path={path} {...chapter} />]
        : [];
    return head
        .concat(buildNodes(chapter.content, range, path, refHandler));
}

function buildBook(book: LoadedBook, range: BookRange, refHandler: NodeRefHandler) {
    const head = range.start.length === 0
        ? [<BookTitle key={`bt`} text={book.content.meta.title} />]
        : [];
    return head
        .concat(buildNodes(book.content.content, range, [], refHandler));
}

function subpathCouldBeInRange(path: BookPath, range: BookRange): boolean {
    if (range.end && !pathLessThan(path, range.end)) {
        return false;
    }

    const part = range.start.slice(0, path.length);
    const could = !pathLessThan(path, part);
    return could;
}

function pathToString(path: BookPath): string {
    return path.join('-');
}

function stringToPath(str: string): BookPath {
    const path = str.split('-')
        .map(p => parseInt(p, 10));

    return path;
}

export function countToPath(nodes: BookNode[], path: BookPath): number {
    if (path.length > 0) {
        const head = path[0];
        const countFront = nodes
            .slice(0, head)
            .map(n => countElements(n))
            .reduce((total, curr) => total + curr, 0);

        const nextNode = nodes[head];
        if (isChapter(nextNode)) {
            return countFront + countToPath(nextNode.content, path.slice(1));
        } else {
            return countFront;
        }
    } else {
        return 1;
    }
}

function countElements(node: BookNode): number {
    if (isParagraph(node)) {
        return 1;
    } else if (isChapter(node)) {
        return 1 + node.content
            .map(n => countElements(n))
            .reduce((total, curr) => total + curr);
    } else {
        return assertNever(node);
    }
}

export function computeRangeForPath(book: BookContent, path: BookPath): BookRange {
    const iterator = iterateToPath(bookIterator(book), path);
    const chapter = findChapterLevel(iterator);

    const nextChapter = nextIterator(chapter);

    const range = bookRange(
        buildPath(chapter),
        nextChapter && buildPath(nextChapter),
    );

    return range;
}

function findChapterLevel(i: OptBookIterator): OptBookIterator {
    if (!i) {
        return undefined;
    }
    if (isChapter(i.node) && i.node.level === 0) {
        return i;
    } else {
        return findChapterLevel(i.parent());
    }
}

function buildPaths(path: BookPath, toc: TableOfContents): {
    prev?: BookPath,
    current: BookPath,
    next?: BookPath,
} {
    let current = emptyPath();
    let prev: BookPath | undefined;
    let skipFirst = false;

    for (const item of toc.items.filter(i => i.level === 0)) {
        if (skipFirst) {
            const next = item.path;

            if (inRange(path, bookRange(current, next))) {
                return { prev, current, next };
            }

            prev = current;
            current = next;
        }
        skipFirst = true;
    }

    return { prev, current };
}

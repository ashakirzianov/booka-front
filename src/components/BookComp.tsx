import * as React from 'react';
import { throttle } from 'lodash';
import {
    Book, BookNode, Chapter, Paragraph,
    isParagraph, ActualBook, ErrorBook, isChapter,
} from '../model';
import { assertNever } from '../utils';
import { Comp, connected, Callback } from './comp-utils';
import {
    ParagraphText, ActivityIndicator, StyledText, Row, Label,
    ScrollView,
    IncrementalLoad,
} from './Elements';
import { refable, RefType, scrollToRef, isPartiallyVisible } from './Scroll.platform';

export const BookComp = connected(['positionToNavigate'], ['updateCurrentBookPosition'])<Book>(props => {
    switch (props.book) {
        case 'error':
            return <ErrorBookComp {...props} />;
        case 'book':
            return <ActualBookComp
                pathToNavigate={props.positionToNavigate}
                updateCurrentBookPosition={props.updateCurrentBookPosition}
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

type Path = number[];

const ParagraphComp = refable<{ p: Paragraph, path: Path }>(props =>
    <ParagraphText text={props.p} />,
);

const ChapterHeader = refable<Chapter & { path: Path }>(props =>
    props.level === 0 ? <ChapterTitle text={props.title} />
        : props.level > 0 ? <PartTitle text={props.title} />
            : <SubpartTitle text={props.title} />,
);

type RefMap = { [k in string]?: RefType };
type ActualBookCompProps = ActualBook & {
    pathToNavigate: Path | null,
    updateCurrentBookPosition: Callback<Path>,
};
class ActualBookComp extends React.Component<ActualBookCompProps> {
    public refMap: RefMap = {};

    public handleScroll = throttle(() => {
        const newCurrentPath = Object.entries(this.refMap)
            .reduce<Path | undefined>((path, [key, ref]) =>
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
                setTimeout(this.scrollToCurrentPath.bind(this), 500);
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
            <IncrementalLoad
                increment={250}
                initial={50}
            >
                {buildBook(props, (ref, path) => {
                    this.refMap = {
                        ...this.refMap,
                        [pathToString(path)]: ref,
                    };
                })}
            </IncrementalLoad>
        </ScrollView>;
    }
}

type NodeRefHandler = (ref: RefType, path: Path) => void;
function buildNodes(nodes: BookNode[], headPath: Path, refHandler: NodeRefHandler): JSX.Element[] {
    return nodes
        .map((bn, i) => buildNode(bn, headPath.concat([i]), refHandler))
        .reduce((acc, arr) => acc.concat(arr))
        ;
}

function buildNode(node: BookNode, path: Path, refHandler: NodeRefHandler) {
    if (isParagraph(node)) {
        return buildParagraph(node, path, refHandler);
    } else if (isChapter(node)) {
        return buildChapter(node, path, refHandler);
    } else {
        return assertNever(node, path.toString());
    }
}

function buildParagraph(paragraph: Paragraph, path: Path, refHandler: NodeRefHandler) {
    return [<ParagraphComp key={`p-${pathToString(path)}`} p={paragraph} path={path} ref={ref => refHandler(ref, path)} />];
}

function buildChapter(chapter: Chapter, path: Path, refHandler: NodeRefHandler) {
    return [<ChapterHeader ref={ref => refHandler(ref, path)} key={`ch-${pathToString(path)}`} path={path} {...chapter} />]
        .concat(buildNodes(chapter.content, path, refHandler));
}

function buildBook(book: ActualBook, refHandler: NodeRefHandler) {
    return [<BookTitle key={`bt`} text={book.meta.title} />]
        .concat(buildNodes(book.content, [], refHandler));
}

function pathToString(path: Path): string {
    return path.join('-');
}

function stringToPath(str: string): Path {
    const path = str.split('-')
        .map(p => parseInt(p, 10));

    return path;
}

export function countToPath(nodes: BookNode[], path: Path): number {
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

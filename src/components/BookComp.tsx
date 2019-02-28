import * as React from 'react';
import { Comp, connected } from './comp-utils';
import {
    Book, BookNode, Chapter, Paragraph,
    isParagraph, ActualBook, ErrorBook, isChapter,
} from '../model';
import {
    ParagraphText, ActivityIndicator, StyledText, Row, Label,
    ScrollView,
    IncrementalLoad,
} from './Elements';
import { assertNever } from '../utils';
import { scrollableUnit, didUpdateHook, scrollToPath } from './BookComp.platform';

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

type ParagraphProps = { p: Paragraph, path: Path };
const ParagraphContent = scrollableUnit<ParagraphProps>(props =>
    <ParagraphText text={props.p} />,
);

const ConnectedParagraph = connected([], ['updateCurrentBookPosition'])<ParagraphProps>(props =>
    <ParagraphContent {...props} onScrollVisible={path => props.updateCurrentBookPosition(path)} />,
);

const ChapterHeader = scrollableUnit<Chapter>(props =>
    props.level === 0 ? <ChapterTitle text={props.title} />
        : props.level > 0 ? <PartTitle text={props.title} />
            : <SubpartTitle text={props.title} />,
);

const ActualBookComp = didUpdateHook<ActualBook & { path: Path | null }>(props =>
    <ScrollView>
        <IncrementalLoad
            increment={250}
            initial={props.path ? countToPath(props.content, props.path) : 50}
        >
            {buildBook(props)}
        </IncrementalLoad>
    </ScrollView>,
);

export const BookComp = connected(['positionToNavigate'])<Book>(props => {
    switch (props.book) {
        case 'error':
            return <ErrorBookComp {...props} />;
        case 'book':
            return <ActualBookComp {...props} path={props.positionToNavigate} didUpdate={() => {
                if (props.positionToNavigate) {
                    scrollToPath(props.positionToNavigate);
                }
            }} />;
        case 'loading':
            return <ActivityIndicator />;
        default:
            return assertNever(props);
    }
});

const ErrorBookComp: Comp<ErrorBook> = props =>
    <Label text={'Error: ' + props.error} />;

function buildNodes(nodes: BookNode[], headPath: Path): JSX.Element[] {
    return nodes
        .map((bn, i) => buildNode(bn, headPath.concat([i])))
        .reduce((acc, arr) => acc.concat(arr))
        ;
}

function buildNode(node: BookNode, path: Path) {
    if (isParagraph(node)) {
        return buildParagraph(node, path);
    } else if (isChapter(node)) {
        return buildChapter(node, path);
    } else {
        return assertNever(node, path.toString());
    }
}

function buildParagraph(paragraph: Paragraph, path: Path) {
    return [<ConnectedParagraph key={`p-${pathToString(path)}`} p={paragraph} path={path} />]; // TODO: add 'onScrollVisible'
}

function buildChapter(chapter: Chapter, path: Path) {
    return [<ChapterHeader key={`ch-${pathToString(path)}`} path={path} {...chapter} />]
        .concat(buildNodes(chapter.content, path));
}

function buildBook(book: ActualBook) {
    return [<BookTitle key={`bt`} text={book.meta.title} />]
        .concat(buildNodes(book.content, []));
}

function pathToString(path: Path): string {
    return path.join('-');
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

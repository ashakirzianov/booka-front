import * as React from 'react';
import { Comp, comp, connected } from './comp-utils';
import {
    Book, BookNode, Chapter, Paragraph,
    isParagraph, ActualBook, ErrorBook,
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

const ParagraphContent = scrollableUnit<Paragraph>(props =>
    <ParagraphText text={props} />,
);

const ConnectedParagraph = connected([], ['updateCurrentBookPosition'])<Paragraph & { path: Path }>(props =>
    <ParagraphContent {...props} onScrollVisible={path => props.updateCurrentBookPosition(path)} />,
);

const ChapterHeader = scrollableUnit<Chapter>(props =>
    props.level === 0 ? <ChapterTitle text={props.title} />
        : props.level > 0 ? <PartTitle text={props.title} />
            : <SubpartTitle text={props.title} />,
);

const ActualBookComp = comp<ActualBook>(props =>
    <ScrollView>
        <IncrementalLoad increment={50}>
            {buildBook(props)}
        </IncrementalLoad>
    </ScrollView>,
);

const BookComp = didUpdateHook<Book>(props => {
    switch (props.book) {
        case 'error':
            return <ErrorBookComp {...props} />;
        case 'book':
            return <ActualBookComp {...props} />;
        case 'loading':
            return <ActivityIndicator />;
        default:
            return assertNever(props);
    }
});

const ConnectedBookComp = connected(['positionToNavigate'])<Book>(props =>
    <BookComp {...props} didUpdate={() => {
        if (props.positionToNavigate) {
            scrollToPath(props.positionToNavigate);
        }
    }} />,
);

export { ConnectedBookComp as BookComp };

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
    } else if (node.book === 'chapter') {
        return buildChapter(node, path);
    } else {
        return assertNever(node as never, path.toString()); // TODO: why need to cast to never ?
    }
}

function buildParagraph(paragraph: Paragraph, path: Path) {
    return [<ConnectedParagraph key={`p-${pathToString(path)}`} {...paragraph} path={path} />]; // TODO: add 'onScrollVisible'
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

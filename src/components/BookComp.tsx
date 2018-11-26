import * as React from 'react';
import { Comp } from './comp-utils';
import {
    Book, BookNode, Chapter, Paragraph,
    isParagraph, NoBook, ActualBook, ErrorBook,
} from '../model';
import {
    TextBlock, Column, BookTitle, ChapterTitle, PartTitle, SubpartTitle,
    loadable,
} from './Elements';
import { assertNever } from '../utils';

const ParagraphComp: Comp<{ p: Paragraph }> = props =>
    <TextBlock text={props.p} />;

const ChapterComp: Comp<Chapter> = props =>
    <Column>
        {
            props.level === 0 ? <ChapterTitle text={props.title} />
                : props.level > 0 ? <PartTitle text={props.title} />
                    : <SubpartTitle text={props.title} />
        }
        {buildNodes(props.content)}
    </Column>;

const BookNodeComp: Comp<{ node: BookNode, count: number }> = props =>
    isParagraph(props.node) ? <ParagraphComp p={props.node} />
        : props.node.book === 'chapter' ? <ChapterComp {...props.node} />
            : assertNever(props.node as never, props.count.toString());

const ActualBookComp: Comp<ActualBook> = props =>
    <Column maxWidth={50} align='flex-start' margin={1.5}>
        <BookTitle text={props.meta.title} />
        {buildNodes(props.content)}
    </Column>;

const BookComp = loadable<Book>(props =>
    props.book === 'no-book' ? <NoBookComp {...props} />
        : props.book === 'error' ? <ErrorBookComp {...props} />
            : props.book === 'book' ? <ActualBookComp {...props} />
                : assertNever(props)
);

const NoBookComp: Comp<NoBook> = props =>
    <div>No book selected</div>;

const ErrorBookComp: Comp<ErrorBook> = props =>
    <div>{props.error}</div>;

function buildNodes(nodes: BookNode[]) {
    return nodes.map((bn, i) => <BookNodeComp key={i} node={bn} count={i} />);
}

export { BookComp };

import * as React from 'react';
import { Comp, connected } from './comp-utils';
import {
    Book, BookNode, Chapter, Paragraph,
    isParagraph, NoBook, ActualBook, ErrorBook,
} from '../model';
import {
    ParagraphText, Column, ActivityIndicator, Text, Row, Label,
} from './Elements';
import { assertNever } from '../utils';

export const ChapterTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'center' }}>
        <Text>{props.text}</Text>
    </Row>;

export const PartTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 30 }}>{props.text}</Text>
    </Row>;

export const SubpartTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'flex-start' }}>
        <Text style={{ fontWeight: 'bold' }}>{props.text}</Text>
    </Row>;

export const BookTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'center', width: '100%' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 36 }}>{props.text}</Text>
    </Row>;

const ParagraphComp: Comp<{ p: Paragraph }> = props =>
    <ParagraphText text={props.p} />;

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

const BookComp: Comp<Book> = (props =>
    props.book === 'no-book' ? <NoBookComp {...props} />
        : props.book === 'error' ? <ErrorBookComp {...props} />
            : props.book === 'book' ? <ActualBookComp {...props} />
                : props.book === 'loading' ? <ActivityIndicator />
                    : assertNever(props)
);

export const ConnectedBookComp = connected(['currentBook'])(
    props => <BookComp {...props.currentBook} />
);

const NoBookComp: Comp<NoBook> = props =>
    <Label text='No book selected' />;

const ErrorBookComp: Comp<ErrorBook> = props =>
    <Label text={'Error: ' + props.error} />;

function buildNodes(nodes: BookNode[]) {
    return nodes.map((bn, i) => <BookNodeComp key={i} node={bn} count={i} />);
}

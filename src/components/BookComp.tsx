import * as React from 'react';
import { Comp, comp } from './comp-utils';
import {
    Book, BookNode, Chapter, Paragraph,
    isParagraph, ActualBook, ErrorBook,
} from '../model';
import {
    ParagraphText, Column, ActivityIndicator, StyledText, Row, Label,
    ScrollView,
} from './Elements';
import { assertNever } from '../utils';
import { scrollableUnit } from './BookComp.platform';

export const ChapterTitle: Comp<{ text?: string }> = props =>
    <Row justifyContent='center'>
        <StyledText>{props.text}</StyledText>
    </Row>;

export const PartTitle: Comp<{ text?: string }> = props =>
    <Row justifyContent='center'>
        <StyledText style={{ fontWeight: 'bold', fontSize: 30 }}>{props.text}</StyledText>
    </Row>;

export const SubpartTitle: Comp<{ text?: string }> = props =>
    <Row justifyContent='flex-start'>
        <StyledText style={{ fontWeight: 'bold' }}>{props.text}</StyledText>
    </Row>;

export const BookTitle: Comp<{ text?: string }> = props =>
    <Row justifyContent='center' width='100%'>
        <StyledText style={{ fontWeight: 'bold', fontSize: 36 }}>{props.text}</StyledText>
    </Row>;

type Path = number[];
type BookNodeProps<T> = T & { path: Path };

const ParagraphComp = scrollableUnit<BookNodeProps<{ p: Paragraph }>>(props =>
    <ParagraphText text={props.p} />
);

const ChapterComp = comp<BookNodeProps<Chapter>>(props =>
    <Column>
        {
            props.level === 0 ? <ChapterTitle text={props.title} />
                : props.level > 0 ? <PartTitle text={props.title} />
                    : <SubpartTitle text={props.title} />
        }
        {buildNodes(props.content, props.path)}
    </Column>
);

const BookNodeComp: Comp<BookNodeProps<{ node: BookNode }>> = props =>
    isParagraph(props.node) ? <ParagraphComp path={props.path} p={props.node} onScrollVisible={() => {
        console.log(props.path)
    }} />
        : props.node.book === 'chapter' ? <ChapterComp path={props.path} {...props.node} />
            : assertNever(props.node as never, props.path.toString());

const ActualBookComp = comp<ActualBook>(props =>
    <ScrollView>
        <BookTitle text={props.meta.title} />
        {buildNodes(props.content, [])}
    </ScrollView>
);

export const BookComp: Comp<Book> = (props =>
    props.book === 'error' ? <ErrorBookComp {...props} />
        : props.book === 'book' ? <ActualBookComp {...props} />
            : props.book === 'loading' ? <ActivityIndicator />
                : assertNever(props)
);

const ErrorBookComp: Comp<ErrorBook> = props =>
    <Label text={'Error: ' + props.error} />;

function buildNodes(nodes: BookNode[], headPath: Path) {
    return nodes.map((bn, i) => <BookNodeComp key={i} node={bn} path={headPath.concat(i)} />);
}

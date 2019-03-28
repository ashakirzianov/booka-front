import * as React from 'react';

import {
    connected, Row, relative, Clickable, Modal, PanelLink,
    comp, WithPopover, Text, Line,
} from '../blocks';
import { BookScreen, Book, Footnote, BookId } from '../model';
import { TableOfContents } from '../model/tableOfContent';
import { linkForLib, linkForToc } from '../logic';
import { BookNodesComp } from './BookContentComp';
import { footnoteForId } from '../model/book.utils';

import { BookComp } from './BookComp';
import { TableOfContentsComp } from './TableOfContentsComp';

export const BookScreenHeader = comp<BookScreen>(props =>
    <Line>
        <Row>
            <LibButton key='back' />
            <OpenTocButton key='toc' bi={props.bl.id} />
        </Row>
        <Row>
            <AppearanceButton key='appearance' />
        </Row>
    </Line>,
);

const LibButton = comp(() =>
    <PanelLink icon='left' to={linkForLib()} />,
);

const OpenTocButton = connected([], ['toggleToc'])<{ bi: BookId }>(props =>
    <PanelLink icon='items' to={linkForToc(props.bi)} action={props.toggleToc} />,
);

const AppearanceButton = comp(() =>
    <WithPopover
        placement='bottom'
        body={<ThemePicker />}
    >
        {onClick => <PanelLink icon='letter' action={onClick} />}
    </WithPopover>,
);

const ThemePicker = comp(props =>
    <Text>Theme picker</Text>,
);

export const BookScreenComp = comp<BookScreen>(props =>
    <>
        <BookText book={props.book} />
        {
            props.book.book === 'book'
                ? <TableOfContentsBox toc={props.book.toc} open={props.tocOpen} />
                : null
        }
        {
            props.book.book === 'book'
                ? <FootnoteBox footnote={footnoteForId(props.book.content, props.footnoteId)} />
                : null
        }
    </>,
);
const BookText = connected([], ['toggleControls'])<{ book: Book }>(props =>
    <Row style={{
        alignItems: 'center',
        maxWidth: relative(50),
    }}
    >
        <Clickable key='book' onClick={() => props.toggleControls()}>
            <BookComp {...props.book} />
        </Clickable>
    </Row>,

);

const TableOfContentsBox = connected([], ['toggleToc'])<{ toc: TableOfContents, open: boolean }>(props =>
    <Modal title='Table of Contents' toggle={props.toggleToc} open={props.open}
    >
        <Row style={{ overflow: 'scroll' }}>
            <TableOfContentsComp {...props.toc} />
        </Row>
    </Modal>,
);

const FootnoteComp = comp<Footnote>(props =>
    <BookNodesComp nodes={props.content} />,
);

const FootnoteBox = connected([], ['openFootnote'])<{ footnote?: Footnote }>(props =>
    <Modal
        title={props.footnote && props.footnote.title}
        open={props.footnote !== undefined}
        toggle={() => props.openFootnote(null)}
    >
        {
            !props.footnote ? null :
                <Row style={{ overflow: 'scroll' }}>
                    <FootnoteComp {...props.footnote} />
                </Row>
        }
    </Modal>,
);

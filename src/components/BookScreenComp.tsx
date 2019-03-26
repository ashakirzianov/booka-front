import * as React from 'react';

import {
    connected, Row, relative, Clickable, ModalBox,
    Label, PanelLink, comp,
} from '../blocks';
import { BookScreen, Book, Footnote, BookId } from '../model';
import { TableOfContents } from '../model/tableOfContent';
import { linkForLib, linkForToc } from '../logic';
import { BookNodesComp } from './BookContentComp';
import { footnoteForId } from '../model/book.utils';
import { letExp } from '../utils';

import { BookComp } from './BookComp';
import { TableOfContentsComp } from './TableOfContentsComp';

export const BookScreenHeader = comp<BookScreen>(props =>
    <>
        <LibButton key='back' />
        <OpenTocButton key='toc' bi={props.bl.id} />
    </>,
);

const LibButton = comp(props =>
    <PanelLink text='<' to={linkForLib()} />,
);

const OpenTocButton = connected([], ['toggleToc'])<{ bi: BookId }>(props =>
    <PanelLink text='...' to={linkForToc(props.bi)} action={props.toggleToc} />,
);

export const BookScreenComp = comp<BookScreen>(props =>
    <>
        <BookText book={props.book} />
        {
            props.tocOpen && props.book.book === 'book'
                ? <TableOfContentsBox toc={props.book.toc} />
                : null
        }
        {
            props.book.book === 'book'
                ? letExp(footnoteForId(props.book.content, props.footnoteId), fn =>
                    fn
                        ? <FootnoteBox footnote={fn} />
                        : null,
                )
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

const TableOfContentsBox = connected([], ['toggleToc'])<{ toc: TableOfContents }>(props =>
    <ModalBox heightPerc={95} maxWidth={60} header={
        <Row style={{ justifyContent: 'space-between', margin: relative(2) }}>
            <PanelLink text='X' action={props.toggleToc} />
            <Label text='Table of Contents' />
            <Row style={{ flex: 1 }} />
        </Row>
    }
        onExternalClick={props.toggleToc}
    >

        <Row style={{ overflow: 'scroll' }}>
            <TableOfContentsComp {...props.toc} />
        </Row>
    </ModalBox>,
);

const FootnoteComp = comp<Footnote>(props =>
    <BookNodesComp nodes={props.content} />,
);

const FootnoteBox = connected([], ['openFootnote'])<{ footnote: Footnote }>(props =>
    <ModalBox maxWidth={60} header={
        <Row style={{ justifyContent: 'space-between', margin: relative(2) }}>
            <PanelLink text='X' action={() => props.openFootnote(null)} />
            <Label text={props.footnote.title || ''} />
            <Row style={{ flex: 1 }} />
        </Row>
    }
        onExternalClick={() => props.openFootnote(null)}
    >

        <Row style={{ overflow: 'scroll' }}>
            <FootnoteComp {...props.footnote} />
        </Row>
    </ModalBox>,
);

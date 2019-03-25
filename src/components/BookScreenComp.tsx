import * as React from 'react';

import { BookScreen, Book } from '../model';
import { BookComp } from './BookComp';
import { Comp, connected, relative } from './comp-utils';
import { TableOfContentsComp } from './TableOfContentsComp';
import { Row, LinkButton, Label, ModalBox } from './Elements';
import { ClickResponder } from './Atoms';
import { TableOfContents } from '../model/tableOfContent';
import { linkForLib } from '../logic';

export const BookScreenHeader: Comp = (props =>
    <>
        <LibButton key='back' />
        <OpenTocButton key='toc' />
    </>
);

const LibButton: Comp = (props =>
    <LinkButton text='<' link={linkForLib()} />
);

const OpenTocButton = connected([], ['toggleToc'])(props =>
    <LinkButton text='...' onClick={props.toggleToc} />,
);

export const BookScreenComp: Comp<BookScreen> = (props =>
    <>
        <BookText book={props.book} />
        {
            props.tocOpen && props.book.book === 'book'
                ? <TableOfContentsBox toc={props.book.toc} />
                : null
        }
    </>
);
const BookText = connected([], ['toggleControls'])<{ book: Book }>(props =>
    <Row style={{
        alignItems: 'center',
        maxWidth: relative(50),
    }}
    >
        <ClickResponder key='book' onClick={() => props.toggleControls()}>
            <BookComp {...props.book} />
        </ClickResponder>
    </Row>,

);

const TableOfContentsBox = connected([], ['toggleToc'])<{ toc: TableOfContents }>(props =>
    <ModalBox color='gray' heightPerc={95} maxWidth={60} header={
        <Row style={{ justifyContent: 'space-between', margin: relative(2) }}>
            <LinkButton text='X' onClick={props.toggleToc} />
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

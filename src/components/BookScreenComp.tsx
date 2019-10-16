import * as React from 'react';

import {
    findReference, BookNode, TableOfContents,
} from 'booka-common';
import {
    Row, Column,
    Separator, point, Triad,
} from '../blocks';
import {
    BookScreen, PaletteName,
    Pagination, Theme, BookId,
} from '../model';
import { Reader } from './Reader';
import { TableOfContentsComp } from './TableOfContentsComp';
import { actionCreators } from '../core';
import {
    connectActions,
    TagButton, IconButton, TextButton, PaletteButton, TextLine,
    WithPopover, Modal,
} from './Connected';
import { AccountButton } from './AccountButton';

export type BookScreenProps = {
    screen: BookScreen,
};
export function BookScreenComp({ screen }: BookScreenProps) {
    const { book, bl } = screen;
    const pagination = React.useRef<Pagination>(new Pagination(book.book));
    const footnote = bl.footnoteId !== undefined
        ? findReference(book.book.nodes, bl.footnoteId)
        : undefined;
    return <>
        <Reader
            book={book}
            quoteRange={bl.quote}
        />
        <TableOfContentsBox
            bookId={bl.id}
            bookTitle={book.book.meta.title}
            toc={book.toc}
            open={bl.toc}
            pagination={pagination.current}
        />
        <FootnoteBox
            // TODO: remove 'as'
            footnote={footnote && footnote[0] as BookNode}
        />
    </>;
}

export type BookScreenHeaderProps = {
    theme: Theme,
};
export function BookScreenHeader({ theme }: BookScreenHeaderProps) {
    return <Triad
        left={<LibButton />}
        right={<>
            <AppearanceButton />
            <AccountButton theme={theme} />
        </>}
    />;
}

export type BookScreenFooterProps = {
    screen: BookScreen,
};
export function BookScreenFooter({ screen }: BookScreenFooterProps) {
    const pagination = new Pagination(screen.book.book);
    const total = pagination.totalPages();
    let currentPage = 1;
    let left = 0;
    if (screen.bl.location.location === 'path') {
        const path = screen.bl.location.path;
        currentPage = pagination.pageForPath(path);
        left = pagination.lastPageOfChapter(path) - currentPage;
    }
    return <Triad
        center={<TocButton current={currentPage} total={total} />}
        right={<TextLine
            text={`${left} pages left`}
            fontSize='smallest'
            color='accent'
        />}
    />;
}

type TocButtonProps = {
    current: number,
    total: number,
};
function TocButton(props: TocButtonProps) {
    return <TagButton
        text={`${props.current} of ${props.total}`}
        action={actionCreators.toggleToc()}
    />;
}

function LibButton() {
    return <IconButton
        icon='left'
        action={actionCreators.navigateToLibrary()}
    />;
}

function AppearanceButton() {
    return <WithPopover
        popoverPlacement='bottom'
        body={<ThemePicker />}
    >
        <IconButton icon='letter' />
    </WithPopover>;
}

type TableOfContentsBoxProps = {
    toc: TableOfContents,
    bookTitle: string | undefined,
    bookId: BookId,
    open: boolean,
    pagination: Pagination,
};
const TableOfContentsBox = connectActions('toggleToc')<TableOfContentsBoxProps>(props => {
    return <Modal
        title={props.bookTitle}
        toggle={props.toggleToc}
        open={props.open}
    >
        <TableOfContentsComp
            toc={props.toc}
            id={props.bookId}
            pagination={props.pagination}
        />
    </Modal>;
}
);

const FootnoteBox = connectActions('openFootnote')<{ footnote?: BookNode }>(props => {
    return <Modal
        open={props.footnote !== undefined}
        toggle={() => props.openFootnote(null)}
    >
        {
            !props.footnote ? null :
                // TODO: put back footnotes
                null // <BookNodesComp nodes={[props.footnote]} />
        }
    </Modal>;
});

function ThemePicker() {
    return <Column width={point(14)}>
        <FontScale />
        <Separator />
        <PalettePicker />
    </Column>;
}

function FontScale() {
    return <Row centered justified height={point(5)}>
        <FontScaleButton increment={-0.1} size='smallest' />
        <FontScaleButton increment={0.1} size='largest' />
    </Row>;
}

type FontScaleButtonProps = {
    increment: number,
    size: 'largest' | 'smallest',
};
function FontScaleButton(props: FontScaleButtonProps) {
    return <Column centered>
        <TextButton
            fontFamily='book'
            text='Abc'
            fontSize={props.size}
            color='accent'
            action={actionCreators
                .incrementScale(props.increment)}
        />
    </Column>;
}

function PalettePicker() {
    return <Row centered justified height={point(5)}>
        <SelectPaletteButton name='light' text='L' />
        <SelectPaletteButton name='sepia' text='S' />
        <SelectPaletteButton name='dark' text='D' />
    </Row>;
}

type PaletteButtonProps = {
    name: PaletteName,
    text: string,
};
function SelectPaletteButton(props: PaletteButtonProps) {
    return <PaletteButton
        text={props.text}
        palette={props.name}
        action={actionCreators.setPalette(props.name)}
    />;
}

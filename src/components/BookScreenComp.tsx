import * as React from 'react';

import {
    TableOfContents,
} from 'booka-common';
import {
    Row, Column,
    Separator, point, Triad,
    TagButton, IconButton, TextButton, PaletteButton, TextLine,
    WithPopover, Modal,
} from '../blocks';
import {
    BookScreen, PaletteName,
    Pagination, Theme, BookId, User, HasTheme,
} from '../model';
import { Reader } from './Reader';
import { TableOfContentsComp } from './TableOfContentsComp';
import { actionCreators } from '../core';
import { AccountButton } from './AccountButton';
import { dispatch } from '../core/store';

export type BookScreenProps = HasTheme & {
    screen: BookScreen,
};
export function BookScreenComp({ screen, theme }: BookScreenProps) {
    const { book, bl } = screen;
    const pagination = React.useRef<Pagination>(new Pagination(book.book));
    return <>
        <Reader
            book={book}
            quoteRange={bl.quote}
        />
        <TableOfContentsBox
            theme={theme}
            bookId={bl.id}
            bookTitle={book.book.meta.title}
            toc={book.toc}
            open={bl.toc}
            pagination={pagination.current}
        />
    </>;
}

export type BookScreenHeaderProps = HasTheme & {
    user: User | undefined,
};
export function BookScreenHeader({ theme, user }: BookScreenHeaderProps) {
    return <Triad
        left={<LibButton theme={theme} />}
        right={<>
            <AppearanceButton theme={theme} />
            <AccountButton theme={theme} user={user} />
        </>}
    />;
}

export type BookScreenFooterProps = {
    screen: BookScreen,
    theme: Theme,
};
export function BookScreenFooter({ screen, theme }: BookScreenFooterProps) {
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
        center={
            <TocButton
                theme={theme}
                current={currentPage}
                total={total}
            />
        }
        right={<TextLine
            theme={theme}
            text={`${left} pages left`}
            fontSize='smallest'
            color='accent'
        />}
    />;
}

type TocButtonProps = {
    theme: Theme,
    current: number,
    total: number,
};
function TocButton(props: TocButtonProps) {
    return <TagButton
        theme={props.theme}
        text={`${props.current} of ${props.total}`}
        onClick={() => {
            dispatch(actionCreators.toggleToc());
        }}
    />;
}

type LibButtonProps = {
    theme: Theme,
};
function LibButton({ theme, }: LibButtonProps) {
    return <IconButton
        theme={theme}
        icon='left'
        onClick={() => {
            dispatch(actionCreators.navigateToLibrary());
        }}
    />;
}

function AppearanceButton({ theme }: HasTheme) {
    return <WithPopover
        theme={theme}
        popoverPlacement='bottom'
        body={<ThemePicker theme={theme} />}
    >
        <IconButton theme={theme} icon='letter' />
    </WithPopover>;
}

type TableOfContentsBoxProps = HasTheme & {
    toc: TableOfContents,
    bookTitle: string | undefined,
    bookId: BookId,
    open: boolean,
    pagination: Pagination,
};
function TableOfContentsBox(props: TableOfContentsBoxProps) {
    return <Modal
        theme={props.theme}
        title={props.bookTitle}
        toggle={() => {
            dispatch(actionCreators.toggleToc());
        }}
        open={props.open}
    >
        <TableOfContentsComp
            toc={props.toc}
            id={props.bookId}
            pagination={props.pagination}
        />
    </Modal>;
}

function ThemePicker({ theme }: HasTheme) {
    return <Column width={point(14)}>
        <FontScale theme={theme} />
        <Separator />
        <PalettePicker theme={theme} />
    </Column>;
}

function FontScale({ theme }: HasTheme) {
    return <Row centered justified height={point(5)}>
        <FontScaleButton theme={theme} increment={-0.1} size='smallest' />
        <FontScaleButton theme={theme} increment={0.1} size='largest' />
    </Row>;
}

type FontScaleButtonProps = HasTheme & {
    increment: number,
    size: 'largest' | 'smallest',
};
function FontScaleButton(props: FontScaleButtonProps) {
    return <Column centered>
        <TextButton
            theme={props.theme}
            fontFamily='book'
            text='Abc'
            fontSize={props.size}
            color='accent'
            onClick={() => {
                dispatch(actionCreators.incrementScale(props.increment));
            }}
        />
    </Column>;
}

function PalettePicker({ theme }: HasTheme) {
    return <Row centered justified height={point(5)}>
        <SelectPaletteButton theme={theme} name='light' text='L' />
        <SelectPaletteButton theme={theme} name='sepia' text='S' />
        <SelectPaletteButton theme={theme} name='dark' text='D' />
    </Row>;
}

type PaletteButtonProps = HasTheme & {
    name: PaletteName,
    text: string,
};
function SelectPaletteButton(props: PaletteButtonProps) {
    return <PaletteButton
        theme={props.theme}
        text={props.text}
        palette={props.name}
        onClick={() => {
            dispatch(actionCreators.setPalette(props.name));
        }}
    />;
}

import * as React from 'react';

import { resolveBookReference, BookContentNode } from 'booka-common';
import {
    Row, Column,
    Separator, point, Triad,
} from '../blocks';
import {
    BookScreen, TableOfContents, PaletteName,
    Pagination, Theme,
} from '../model';
import { Reader, BookNodesComp } from './Reader';
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
    const footnote = bl.footnoteId !== undefined
        ? resolveBookReference(book.volume, bl.footnoteId)
        : undefined;
    return <>
        <Reader
            book={book}
            quoteRange={bl.quote}
        />
        <TableOfContentsBox
            toc={book.toc}
            open={bl.toc}
        />
        <FootnoteBox
            footnote={footnote}
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
    const pagination = new Pagination(screen.book.volume);
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

const TableOfContentsBox = connectActions('toggleToc')<{ toc: TableOfContents, open: boolean }>(props =>
    <Modal
        title={props.toc.title}
        toggle={props.toggleToc}
        open={props.open}
    >
        <TableOfContentsComp toc={props.toc} />
    </Modal>
);

// TODO: fix
const FootnoteBox = connectActions('openFootnote')<{ footnote?: BookContentNode }>(props =>
    <Modal
        // TODO: show footnote title
        // title={props.footnote && props.footnote.title[0]}
        open={props.footnote !== undefined}
        toggle={() => props.openFootnote(null)}
    >
        {
            !props.footnote ? null :
                <BookNodesComp nodes={[props.footnote]} />
        }
    </Modal>
);

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

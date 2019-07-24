import * as React from 'react';

import {
    connectActions, Row, Modal,
    WithPopover, Line, Column,
    Separator, TextLine, point, Triad,
} from '../blocks';
import {
    BookScreen, TableOfContents, PaletteName,
    FootnoteSpan, footnoteForId, Pagination,
} from '../model';
import { BookNodesComp } from './Reader';

import { BookComp } from './BookComp';
import { TableOfContentsComp } from './TableOfContentsComp';
import { actionCreators } from '../core';
import { TagButton, IconButton, TextButton, PaletteButton } from './Connected';

export function BookScreenComp(props: BookScreen) {
    return <>
        <BookComp
            {...props.book}
            quoteRange={props.bl.quote}
        />
        <TableOfContentsBox
            toc={props.book.toc}
            open={props.bl.toc}
        />
        <FootnoteBox
            footnote={
                props.bl.footnoteId !== undefined
                    ? footnoteForId(props.book.volume, props.bl.footnoteId)
                    : undefined
            }
        />
    </>;
}

export function BookScreenHeader(props: BookScreen) {
    return <Line paddingHorizontal={point(1)}>
        <Row>
            <LibButton key='back' />
        </Row>
        <Row>
            <AppearanceButton key='appearance' />
        </Row>
    </Line>;
}

export function BookScreenFooter(props: BookScreen) {
    const pagination = new Pagination(props.book.volume);
    const total = pagination.totalPages();
    let currentPage = 1;
    let left = 0;
    if (props.bl.location.location === 'path') {
        const path = props.bl.location.path;
        currentPage = pagination.pageForPath(path);
        left = pagination.lastPageOfChapter(path) - currentPage;
    }
    return <Triad
        center={<TocButton current={currentPage} total={total} />}
        right={<TextLine
            text={`${left} pages left`}
            size='smallest'
            family='menu'
            color='accent'
        />}
        paddingHorizontal={point(1)}
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
        {
            onClick =>
                <IconButton icon='letter' onClick={onClick} />
        }
    </WithPopover>;
}

const TableOfContentsBox = connectActions('toggleToc')<{ toc: TableOfContents, open: boolean }>(props =>
    <Modal
        title={props.toc.title}
        toggle={props.toggleToc}
        open={props.open}
    >
        <TableOfContentsComp {...props.toc} />
    </Modal>
);

const FootnoteBox = connectActions('openFootnote')<{ footnote?: FootnoteSpan }>(props =>
    <Modal
        title={props.footnote && props.footnote.title[0]}
        open={props.footnote !== undefined}
        toggle={() => props.openFootnote(null)}
    >
        {
            !props.footnote ? null :
                <BookNodesComp nodes={[{
                    node: 'paragraph',
                    span: props.footnote,
                }]} />
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
            text='Abc'
            size={props.size}
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

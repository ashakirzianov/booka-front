import * as React from 'react';

import {
    connectActions, Row, Modal,
    Comp, WithPopover, Line, Column,
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

export const BookScreenComp: Comp<BookScreen> = (props =>
    <>
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
    </>
);

export const BookScreenHeader: Comp<BookScreen> = (props =>
    <Line>
        <Row>
            <LibButton key='back' />
        </Row>
        <Row>
            <AppearanceButton key='appearance' />
        </Row>
    </Line>
);

export const BookScreenFooter: Comp<BookScreen> = (props => {
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
        rightPadding={10}
    />;
});

type TocButtonProps = { current: number, total: number };
function TocButton(props: TocButtonProps) {
    return <TagButton
        text={`${props.current} of ${props.total}`}
        action={actionCreators.toggleToc()}
    />;
}

const LibButton: Comp = (() =>
    <IconButton
        icon='left'
        action={actionCreators.navigateToLibrary()}
    />
);

const AppearanceButton: Comp = (() =>
    <WithPopover
        popoverPlacement='bottom'
        body={<ThemePicker />}
    >
        {
            onClick =>
                <IconButton icon='letter' onClick={onClick} />
        }
    </WithPopover>
);

const TableOfContentsBox = connectActions('toggleToc')<{ toc: TableOfContents, open: boolean }>(props =>
    <Modal
        title={props.toc.title}
        toggle={props.toggleToc}
        open={props.open}
    >
        <Column scroll>
            <TableOfContentsComp {...props.toc} />
        </Column>
    </Modal>
);

const FootnoteComp: Comp<FootnoteSpan> = (props =>
    <BookNodesComp nodes={[{
        node: 'paragraph',
        span: props.footnote,
    }]} />
);

const FootnoteBox = connectActions('openFootnote')<{ footnote?: FootnoteSpan }>(props =>
    <Modal
        title={props.footnote && props.footnote.title[0]}
        open={props.footnote !== undefined}
        toggle={() => props.openFootnote(null)}
    >
        {
            !props.footnote ? null :
                <Row scroll>
                    <FootnoteComp {...props.footnote} />
                </Row>
        }
    </Modal>
);

const ThemePicker: Comp = (props =>
    <Column width={point(14)}>
        <FontScale />
        <Separator />
        <PalettePicker />
    </Column>
);

const FontScale: Comp = (() =>
    <Column centered height={point(5)}>
        <Row centered>
            <FontScaleButton increment={-0.1} size='smallest' />
            <FontScaleButton increment={0.1} size='largest' />
        </Row>
    </Column>
);

const FontScaleButton = connectActions('incrementScale')<{
    increment: number,
    size: 'largest' | 'smallest',
}>(props => {
    return <Column centered>
        <TextButton
            text='Abc'
            size={props.size}
            color='accent'
            action={actionCreators
                .incrementScale(props.increment)}
        />
    </Column>;
});

const PalettePicker: Comp = (() =>
    <Column centered height={point(5)}>
        <Row centered>
            <SelectPaletteButton name='light' text='L' />
            <SelectPaletteButton name='sepia' text='S' />
            <SelectPaletteButton name='dark' text='D' />
        </Row>
    </Column>
);

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

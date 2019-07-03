import * as React from 'react';

import {
    connectActions, Row, Clickable, Modal, PanelButton,
    Comp, WithPopover, Line, Column, PlainText,
    hoverable, View, Separator, connectState, ThemedText, themed, colors, TagButton, ActionLink, Hoverable, ActionButton, point,
} from '../blocks';
import {
    BookScreen, Book, TableOfContents, PaletteName, BookRange,
    FootnoteSpan, footnoteForId, Pagination,
} from '../model';
import { BookNodesComp } from './Reader';

import { BookComp } from './BookComp';
import { TableOfContentsComp } from './TableOfContentsComp';
import { actionCreators } from '../core';

export const BookScreenComp: Comp<BookScreen> = (props =>
    <>
        <BookText
            book={props.book}
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
    return <Row style={{
        position: 'relative',
    }}>
        <Column style={{
            position: 'absolute',
            top: 0, bottom: 0, left: 0, right: 0,
            height: '100%', width: '100%',
            justifyContent: 'center',
        }}>
            <Row style={{ justifyContent: 'center' }}>
                <TocButton current={currentPage} total={total} />
            </Row>
        </Column>
        <Column style={{
            position: 'absolute',
            right: 10, top: 0, height: '100%',
            justifyContent: 'center',
        }}>
            <ThemedText
                size='smallest'
                fixedSize={true}
                family='menu'
                color='accent'
            >
                {`${left} left`}
            </ThemedText>
        </Column>
    </Row>;
});

type TocButtonProps = { current: number, total: number };
const TocButton = themed<TocButtonProps>(props =>
    <ActionButton action={actionCreators.toggleToc()}>
        <TagButton color={colors(props).accent}>
            <ThemedText
                size='smallest'
                fixedSize={true}
                family='menu'
                color='secondary'
            >
                {`${props.current} of ${props.total}`}
            </ThemedText>
        </TagButton>
    </ActionButton>
);

const LibButton: Comp = (() =>
    <PanelButton icon='left' action={actionCreators.navigateToLibrary()} />
);

const AppearanceButton: Comp = (() =>
    <WithPopover
        popoverPlacement='bottom'
        body={<ThemePicker />}
    >
        {onClick => <PanelButton icon='letter' onClick={onClick} />}
    </WithPopover>
);

type BookTextProps = {
    book: Book,
    quoteRange: BookRange | undefined,
};
const BookText = connectActions('toggleControls')<BookTextProps>(props =>
    <Row style={{
        alignItems: 'center',
        maxWidth: point(50),
        marginHorizontal: point(2),
    }}
    >
        <Clickable key='book' onClick={() => props.toggleControls()}>
            <BookComp {...props.book} quoteRange={props.quoteRange} />
        </Clickable>
    </Row>

);

const TableOfContentsBox = connectActions('toggleToc')<{ toc: TableOfContents, open: boolean }>(props =>
    <Modal title={props.toc.title} toggle={props.toggleToc} open={props.open}
    >
        <Row style={{ overflow: 'scroll' }}>
            <TableOfContentsComp {...props.toc} />
        </Row>
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
                <Row style={{ overflow: 'scroll' }}>
                    <FootnoteComp {...props.footnote} />
                </Row>
        }
    </Modal>
);

const ThemePicker: Comp = (props =>
    <Column style={{
        width: point(14),
    }}>
        <FontScale />
        <Separator />
        <PalettePicker />
    </Column>
);

const FontScale: Comp = (() =>
    <Column style={{
        justifyContent: 'center',
        height: point(5),
    }}>
        <Row style={{ justifyContent: 'space-around' }}>
            <FontScaleButton increment={-0.1} size={18} />
            <FontScaleButton increment={0.1} size={36} />
        </Row>
    </Column>
);

const FontScaleButton = connectActions('incrementScale')<{
    increment: number,
    size: number,
}>(props =>
    <Column style={{
        justifyContent: 'center',
    }}>
        <ActionLink action={actionCreators.incrementScale(props.increment)}>
            <Hoverable>
                <PlainText style={{ fontSize: props.size }}>Abc</PlainText>
            </Hoverable>
        </ActionLink>
    </Column>
);

const PalettePicker: Comp = (() =>
    <Column style={{
        justifyContent: 'center',
        height: point(5),
    }}>
        <Row style={{ justifyContent: 'space-around' }}>
            <PaletteButton name='light' text='L' />
            <PaletteButton name='sepia' text='S' />
            <PaletteButton name='dark' text='D' />
        </Row>
    </Column>
);

const HoverableView = hoverable(View);
const PaletteButton = connectState('theme')<{
    name: PaletteName,
    text: string,
}>(props => {
    const palette = props.theme.palettes[props.name].colors;
    return <ActionLink action={actionCreators.setPalette(props.name)}>
        <HoverableView style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            backgroundColor: palette.primary,
            borderRadius: 50,
            borderColor: palette.highlight, // 'orange' ?
            borderWidth: props.name === props.theme.currentPalette ? 3 : 0,
            shadowColor: palette.shadow,
            shadowRadius: 5,
            ':hover': {
                borderWidth: 3,
            },
        }}>
            <Row style={{ justifyContent: 'center' }}>
                <PlainText style={{
                    fontSize: props.theme.fontSizes.normal,
                    color: palette.text,
                }}>{props.text}</PlainText>
            </Row>
        </HoverableView>
    </ActionLink>;
}
);

import * as React from 'react';

import {
    connected, Row, relative, Clickable, Modal, PanelLink,
    comp, WithPopover, Line, Column, Link, PlainText, hoverable, View, Separator,
} from '../blocks';
import { BookScreen, Book, Footnote, BookId, TableOfContents, PaletteName } from '../model';
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

const ThemePicker = comp(props =>
    <Column style={{
        width: relative(14),
    }}>
        <FontScale />
        <Separator />
        <PalettePicker />
    </Column>,
);

const FontScale = comp(() =>
    <Column style={{
        justifyContent: 'center',
        height: relative(5),
    }}>
        <Row style={{ justifyContent: 'space-around' }}>
            <FontScaleButton increment={-0.1} size={18} />
            <FontScaleButton increment={0.1} size={36} />
        </Row>
    </Column>,
);

const FontScaleButton = connected([], ['incrementScale'])<{
    increment: number,
    size: number,
}>(props =>
    <Column style={{
        justifyContent: 'center',
    }}>
        <Link action={() => props.incrementScale(props.increment)}>
            <PlainText style={{ fontSize: props.size }}>Abc</PlainText>
        </Link>
    </Column>,
);

const PalettePicker = comp(() =>
    <Column style={{
        justifyContent: 'center',
        height: relative(5),
    }}>
        <Row style={{ justifyContent: 'space-around' }}>
            <PaletteButton name='light' text='L' />
            <PaletteButton name='sepia' text='S' />
            <PaletteButton name='dark' text='D' />
        </Row>
    </Column>,
);

const HoverableView = hoverable(View);
const PaletteButton = connected(['theme'], ['setPalette'])<{
    name: PaletteName,
    text: string,
}>(props => {
    const palette = props.theme.palettes[props.name];
    return <Link action={() => props.setPalette(props.name)}>
        <HoverableView style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            backgroundColor: palette.primary,
            borderRadius: 50,
            borderColor: palette.highlight, // 'orange' ?
            borderWidth: props.name === props.theme.currentPalette ? 3 : 0,
            shadowColor: palette.shadow,
            shadowRadius: 4,
            [':hover']: {
                borderWidth: 3,
            },
        }}>
            <Row style={{ justifyContent: 'center' }}>
                <PlainText style={{
                    fontSize: props.theme.fontSize.normal,
                    color: palette.text,
                }}>{props.text}</PlainText>
            </Row>
        </HoverableView>
    </Link>;
},
);

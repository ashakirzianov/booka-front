import * as React from 'react';

import {
    connectActions, Row, relative, Clickable, Modal, PanelLink,
    Comp, WithPopover, Line, Column, Link, PlainText, hoverable, View, Separator, connectState,
} from '../blocks';
import { BookScreen, Book, BookId, TableOfContents, PaletteName, BookRange, FootnoteSpan, footnoteForId } from '../model';
import { BookNodesComp } from './Reader';

import { BookComp } from './BookComp';
import { TableOfContentsComp } from './TableOfContentsComp';
import { actionCreators } from '../redux';

export const BookScreenHeader: Comp<BookScreen> = (props =>
    <Line>
        <Row>
            <LibButton key='back' />
            <OpenTocButton key='toc' bi={props.bl.id} />
        </Row>
        <Row>
            <AppearanceButton key='appearance' />
        </Row>
    </Line>
);

const LibButton: Comp = (() =>
    <PanelLink icon='left' action={actionCreators.navigateToLibrary()} />
);

const OpenTocButton: Comp<{ bi: BookId }> = (props =>
    <PanelLink icon='items' action={actionCreators.toggleToc()} />
);

const AppearanceButton: Comp = (() =>
    <WithPopover
        placement='bottom'
        body={<ThemePicker />}
    >
        {onClick => <PanelLink icon='letter' onClick={onClick} />}
    </WithPopover>
);

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
type BookTextProps = {
    book: Book,
    quoteRange: BookRange | undefined,
};
const BookText = connectActions('toggleControls')<BookTextProps>(props =>
    <Row style={{
        alignItems: 'center',
        maxWidth: relative(50),
        marginHorizontal: relative(2),
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
        width: relative(14),
    }}>
        <FontScale />
        <Separator />
        <PalettePicker />
    </Column>
);

const FontScale: Comp = (() =>
    <Column style={{
        justifyContent: 'center',
        height: relative(5),
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
        <Link action={actionCreators.incrementScale(props.increment)}>
            <PlainText style={{ fontSize: props.size }}>Abc</PlainText>
        </Link>
    </Column>
);

const PalettePicker: Comp = (() =>
    <Column style={{
        justifyContent: 'center',
        height: relative(5),
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
    return <Link action={actionCreators.setPalette(props.name)}>
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
    </Link>;
}
);

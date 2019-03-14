import * as React from 'react';

import { Screen, BookScreen, LibraryScreen, TocScreen } from '../model';
import { BookComp } from './BookComp';
import { LibraryComp } from './LibraryComp';
import { assertNever } from '../utils';
import { Comp, comp, connected, relative } from './comp-utils';
import { ScreenLayout } from './ScreenComp.Layout';
import { TableOfContentsComp } from './TableOfContentsComp';
import { Row, LinkButton, ActionButton, Label } from './Elements';
import { ClickResponder, Column } from './Atoms';
import { linkForLib } from '../logic';
import { tocFromBook } from '../model/tableOfContent';
import { ModalBox } from './Atoms.platform';

export const ScreenComp = connected(['controlsVisible'])<Screen>(props =>
    <ScreenLayout
        headerVisible={props.controlsVisible}
        headerTitle={screenTitle(props)}
        header={<ScreenHeader {...props} />}
    >
        <ScreenContentComp {...props} />
    </ScreenLayout>,
);

const ScreenContentComp: Comp<Screen> = (props =>
    props.screen === 'book' ? <BookScreenCont {...props} />
        : props.screen === 'library' ? <LibraryScreenCont {...props} />
            : props.screen === 'toc' ? <TocScreenCont {...props} />
                : assertNever(props)
);

const BookScreenCont = connected(['controlsVisible'], ['toggleControls'])<BookScreen>(props =>
    <Row style={{
        alignItems: 'center',
        maxWidth: relative(50),
    }}
    >
        <ClickResponder key='book' onClick={() => props.toggleControls()}>
            <BookComp {...props.book} />
        </ClickResponder>
        {props.tocOpen && <TableOfContentsCont {...props} />}
    </Row>,

);

export const TableOfContentsCont = connected([], ['toggleToc'])<BookScreen>(props =>
    <ModalBox color='gray' heightPerc={70} maxWidth={60} header={
        <Row style={{ justifyContent: 'space-between', margin: relative(2) }}>
            <ActionButton text='X' onClick={props.toggleToc} />
            <Label text='Table of Contents' />
            <Column />
        </Row>
    }
        onExternalClick={props.toggleToc}
    >

        <Row style={{ overflow: 'scroll' }}>
            <TableOfContentsComp {...tocFromBook(props.book)} />
        </Row>
    </ModalBox>,
);

const LibraryScreenCont = comp<LibraryScreen>(props =>
    <LibraryComp {...props.library} />,
);

const TocScreenCont = comp<TocScreen>(props =>
    <TableOfContentsComp {...props.toc} />,
);

const ScreenHeader: Comp<Screen> = (props =>
    <Row>{
        props.screen === 'library' ? null
            : props.screen === 'toc' ? null
                : props.screen === 'book' ? [
                    <LibButton key='back' />,
                    <OpenTocButton key='toc' />,
                ]
                    : assertNever(props)
    }</Row>
);

const LibButton = comp(props =>
    <LinkButton text='< Lib' link={linkForLib()} />,
);

const OpenTocButton = connected([], ['toggleToc'])(props =>
    <ActionButton text='...' onClick={props.toggleToc} />,
);

function screenTitle(screen: Screen) {
    return screen.screen === 'toc' ? 'Table of Contents'
        : screen.screen === 'library' ? 'Library'
            : screen.screen === 'book' ? undefined
                : assertNever(screen);
}

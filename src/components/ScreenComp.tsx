import * as React from 'react';

import { Screen, BookScreen, LibraryScreen, TocScreen, BookId, BookLocator } from '../model';
import { BookComp } from './BookComp';
import { LibraryComp } from './LibraryComp';
import { assertNever } from '../utils';
import { Comp, comp, connected, relative } from './comp-utils';
import { ScreenLayout } from './ScreenComp.Layout';
import { TableOfContentsComp } from './TableOfContentsComp';
import { Row, LinkButton } from './Elements';
import { ClickResponder } from './Atoms';
import { linkForLib, linkForToc, linkForBook } from '../logic';

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
        margin: relative(2),
    }}
    >
        <ClickResponder onClick={() => props.toggleControls()}>
            <BookComp {...props.book} />
        </ClickResponder>
    </Row>,

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
            : props.screen === 'toc' ? <BookButton bl={props.bl} />
                : props.screen === 'book' ? [
                    <LibButton key='back' />,
                    <TocButton key='toc' bi={props.book.id} />,
                ]
                    : assertNever(props)
    }</Row>
);

const LibButton = comp(props =>
    <LinkButton text='< Lib' link={linkForLib()} />,
);

const TocButton: Comp<{ bi: BookId }> = (props =>
    <LinkButton text='...' link={linkForToc(props.bi)} />
);

const BookButton: Comp<{ bl: BookLocator }> = (props =>
    <LinkButton text='X' link={linkForBook(props.bl)} />
);

function screenTitle(screen: Screen) {
    return screen.screen === 'toc' ? 'Table of Contents'
        : screen.screen === 'library' ? 'Library'
            : screen.screen === 'book' ? undefined
                : assertNever(screen);
}

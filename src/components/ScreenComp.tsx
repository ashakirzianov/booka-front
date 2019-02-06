import * as React from 'react';

import { Screen, BookScreen, LibraryScreen } from '../model';
import { BookComp } from './BookComp';
import { LibraryComp } from './LibraryComp';
import { assertNever } from '../utils';
import { Comp } from './comp-utils';
import { Label, Column, Row } from './Elements';
import { api } from '../api';
import { OptimisticPromise } from '../promisePlus';

type Navigation = { navigateToScreen: OptimisticPromise<Screen> }
export const ScreenComp: Comp<Screen, Navigation> = (props =>
    props.screen === 'book' ? <BookScreenComp {...props} />
        : props.screen === 'library' ? <LibraryScreenComp {...props} />
            : props.screen === 'blank' ? <BlankScreenComp />
                : assertNever(props)
);

const BookScreenComp: Comp<BookScreen> = (props =>
    <BookScreenLayout>
        <BookComp {...props.book} />
    </BookScreenLayout>
);

const Header: Comp<{ title?: string, right?: React.ReactNode }> = (props =>
    <Row width='100%' height='3%' justifyContent='space-between' marginHorizontal={30}>
        {/* Left */}
        <Row>{props.children}</Row>
        {/* Center */}
        <Row>{ props.title && <Label text={props.title}/>}</Row>
        {/* Right */}
        <Row>{props.right}</Row>
    </Row>
);

const BookScreenLayout: Comp = props => (
    <Column width='100%' align='center'>
        <Header title='Title' />
        <Row maxWidth={50} align='center' margin={2}>
            {props.children}
        </Row>
    </Column>
);

const LibraryScreenComp: Comp<LibraryScreen, Navigation> = (props =>
    <LibraryComp {...props.library} openBook={
        bl => props.navigateToScreen && props.navigateToScreen(api.bookScreen(bl))
    } />
);

const BlankScreenComp: Comp = (props =>
    <Label text='Nothing here. This screen should never be visible' />
);
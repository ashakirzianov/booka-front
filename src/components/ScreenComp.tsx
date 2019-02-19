import * as React from 'react';

import { Screen, BookScreen, LibraryScreen } from '../model';
import { BookComp } from './BookComp';
import { LibraryComp } from './LibraryComp';
import { assertNever } from '../utils';
import { Comp, comp, relative, absolute } from './comp-utils';
import { Label, Column, Row, LinkButton } from './Elements';
import { navigateToBl } from '../logic';
import { navigateToLibrary } from '../logic/historyNavigation.platform';

export const ScreenComp: Comp<Screen> = (props =>
    props.screen === 'book' ? <BookScreenComp {...props} />
        : props.screen === 'library' ? <LibraryScreenComp {...props} />
            : props.screen === 'blank' ? <BlankScreenComp />
                : assertNever(props)
);

const BookScreenComp: Comp<BookScreen> = (props =>
    <BookScreenLayout title={props.book.book === 'book' ? props.book.meta.title : ''}>
        <BookComp {...props.book} />
    </BookScreenLayout>
);

const Header: Comp<{ title?: string, right?: React.ReactNode }> = (props =>
    <Row style={{ width: '100%', height: '3%', justifyContent: 'space-between' }}>
        {/* Left */}
        <Row>{props.children}</Row>
        {/* Center */}
        <Row>{ props.title !== undefined ? <Label text={props.title}/> : undefined }</Row>
        {/* Right */}
        <Row>{props.right}</Row>
    </Row>
);

const BackButton = comp(props =>
    <LinkButton text='< Back' onClick={() => {
        navigateToLibrary();
    }} />
);

const BookScreenLayout: Comp<{title: string}> = props => (
    <Column style={{width: '100%', alignItems: 'center'}}>
        <Header title={props.title}><BackButton /></Header>
        <Row style={{maxWidth: relative(50), alignItems: 'center', margin: absolute(2)}}>
            {props.children}
        </Row>
    </Column>
);

const LibraryScreenComp = comp<LibraryScreen>(props =>
    <LibraryComp {...props.library} openBook={
        bl => navigateToBl(bl)
    } />
);

const BlankScreenComp: Comp = (props =>
    <Label text='Nothing here. This screen should never be visible' />
);
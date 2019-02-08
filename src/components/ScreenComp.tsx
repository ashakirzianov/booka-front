import * as React from 'react';

import { Screen, BookScreen, LibraryScreen } from '../model';
import { BookComp } from './BookComp';
import { LibraryComp } from './LibraryComp';
import { assertNever } from '../utils';
import { Comp, connected } from './comp-utils';
import { Label, Column, Row, LinkButton } from './Elements';
import { buildBookScreen } from '../logic';

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
    <Row width='100%' height='3%' justifyContent='space-between' marginHorizontal={30}>
        {/* Left */}
        <Row>{props.children}</Row>
        {/* Center */}
        <Row>{ props.title !== undefined ? <Label text={props.title}/> : undefined }</Row>
        {/* Right */}
        <Row>{props.right}</Row>
    </Row>
);

const BackButton = connected('navigateBack')(props =>
    <LinkButton text='< Back' onClick={props.navigateBack} />
);

const BookScreenLayout: Comp<{title: string}> = props => (
    <Column width='100%' align='center'>
        <Header title={props.title}><BackButton /></Header>
        <Row maxWidth={50} align='center' margin={2}>
            {props.children}
        </Row>
    </Column>
);

const LibraryScreenComp = connected('navigateToScreen') <LibraryScreen>(props =>
    <LibraryComp {...props.library} openBook={
        bl => props.navigateToScreen && props.navigateToScreen(buildBookScreen(bl))
    } />
);

const BlankScreenComp: Comp = (props =>
    <Label text='Nothing here. This screen should never be visible' />
);
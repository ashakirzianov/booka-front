import * as React from 'react';

import { Screen, BookScreen, LibraryScreen } from '../model';
import { BookComp } from './BookComp';
import { LibraryComp } from './LibraryComp';
import { assertNever } from '../utils';
import { Comp, comp, relative, connected } from './comp-utils';
import { Label, Column, Row, LinkButton } from './Elements';
import { navigateToBl } from '../logic';
import { navigateToLibrary } from '../logic/historyNavigation.platform';
import { TopPanel } from './Atoms';

export const ScreenComp: Comp<Screen> = (props =>
    props.screen === 'book' ? <BookScreenComp {...props} />
        : props.screen === 'library' ? <LibraryScreenComp {...props} />
            : props.screen === 'blank' ? <BlankScreenComp />
                : assertNever(props)
);

const BookScreenComp = connected(['controlsVisible'], ['toggleControls'])<BookScreen>(props =>
    <BookScreenLayout onContentClick={() => props.toggleControls()} showControls={props.controlsVisible}>
        <BookComp {...props.book} />
    </BookScreenLayout>
);

const Header: Comp<{ title?: string, right?: React.ReactNode }> = (props =>
    <TopPanel>
        <Row style={{
        width: '100%', height: relative(5),
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: relative(1),
        backgroundColor: 'black',
    }}>
        {/* Left */}
        <Row>{props.children}</Row>
        {/* Center */}
        <Row>{props.title !== undefined ? <Label text={props.title} /> : undefined}</Row>
        {/* Right */}
        <Row>{props.right}</Row>
    </Row>
    </TopPanel>
    
);

const BackButton = comp(props =>
    <LinkButton text='< Back' onClick={() => {
        navigateToLibrary();
    }} />
);

const BookScreenLayout: Comp<{ showControls: boolean }, { onContentClick: void }> = props => (
    <Column style={{ width: '100%', alignItems: 'center' }}>
        { props.showControls ? <Header><BackButton /></Header> : null }
        <Row style={{
            alignItems: 'center',
            maxWidth: relative(50),
            margin: relative(2), marginTop: relative(5),
        }}
        onClick={() => {
            props.onContentClick && props.onContentClick();
        }}
        >
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
import * as React from 'react';

import { Screen, BookScreen, LibraryScreen } from '../model';
import { BookComp } from './BookComp';
import { LibraryComp } from './LibraryComp';
import { assertNever } from '../utils';
import { Comp, comp, relative, connected, VoidCallback } from './comp-utils';
import { Label, Row, LinkButton } from './Elements';
import { navigateToBl } from '../logic';
import { navigateToLibrary } from '../logic/historyNavigation.platform';
import { TopPanel, ReactContent, ClickResponder, Column } from './Atoms';

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

const BookScreenLayout: Comp<{ showControls: boolean, onContentClick: VoidCallback }> = (props =>
    <ScreenLayout
        header={props.showControls ? <Header><BackButton /></Header> : null}
        onContentClick={() => props.onContentClick()}
        >
        <Row style={{
            alignItems: 'center',
            maxWidth: relative(50),
            margin: relative(2), marginTop: relative(5),
        }}
        >
            {props.children}
        </Row>
    </ScreenLayout>
);

const LibraryScreenComp = comp<LibraryScreen>(props =>
    <LibraryComp {...props.library} openBook={
        bl => navigateToBl(bl)
    } />
);

const BlankScreenComp: Comp = (props =>
    <Label text='Nothing here. This screen should never be visible' />
);

// Layout 



const Header: Comp<{ title?: string, right?: ReactContent }> = (props =>
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

const ScreenLayout: Comp<{
    header?: ReactContent,
    onContentClick?: VoidCallback,
}> = (props =>
    <Column style={{ width: '100%', alignItems: 'center' }}>
        {props.header || null}
        <ClickResponder onClick={props.onContentClick}>
            {props.children}
        </ClickResponder>
    </Column>
    );
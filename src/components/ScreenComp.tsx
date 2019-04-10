import * as React from 'react';

import { connectState, comp, Row, FullScreenActivityIndicator, Column, TopBar, relative } from '../blocks';
import { AppScreen } from '../model';
import { assertNever } from '../utils';
import { BookScreenComp, BookScreenHeader } from './BookScreenComp';
import { LibraryScreenComp, LibraryScreenHeader } from './LibraryScreenComp';

export const ScreenComp = connectState('controlsVisible', 'loading')<AppScreen>(props =>
    <Column style={{ width: '100%', alignItems: 'center' }}>
        {props.loading ? <FullScreenActivityIndicator /> : null}
        <TopBar open={props.controlsVisible}>
            <Header {...props} />
        </TopBar>
        <Row style={{ margin: relative(2) }} />
        <Content {...props} />
    </Column>,
);

const Content = comp<AppScreen>(props =>
    props.screen === 'book' ? <BookScreenComp {...props} />
        : props.screen === 'library' ? <LibraryScreenComp {...props} />
            : assertNever(props),
);

const Header = comp<AppScreen>(props =>
    <Row>
        {
            props.screen === 'library' ? <LibraryScreenHeader />
                : props.screen === 'book' ? <BookScreenHeader {...props} />
                    : assertNever(props)
        }
    </Row>,
);

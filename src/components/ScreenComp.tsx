import * as React from 'react';

import { connected, comp, Comp, Row } from '../blocks';
import { Screen } from '../model';
import { assertNever } from '../utils';
import { ScreenLayout } from './ScreenComp.Layout';
import { BookScreenComp, BookScreenHeader } from './BookScreenComp';
import { LibraryScreenComp, LibraryScreenHeader } from './LibraryScreenComp';

export const ScreenComp = connected(['controlsVisible'])<Screen>(props =>
    <ScreenLayout
        headerVisible={props.controlsVisible}
        headerTitle={screenTitle(props)}
        header={<Header {...props} />}
    >
        <Content {...props} />
    </ScreenLayout>,
);

const Content = comp<Screen>(props =>
    props.screen === 'book' ? <BookScreenComp {...props} />
        : props.screen === 'library' ? <LibraryScreenComp {...props} />
            : assertNever(props),
);

const Header: Comp<Screen> = (props =>
    <Row>
        {
            props.screen === 'library' ? <LibraryScreenHeader />
                : props.screen === 'book' ? <BookScreenHeader {...props} />
                    : assertNever(props)
        }
    </Row>
);

function screenTitle(screen: Screen) {
    return screen.screen === 'library' ? 'Library'
        : screen.screen === 'book' ? undefined
            : assertNever(screen);
}

import * as React from 'react';

import {
    connectState, FullScreenActivityIndicator,
    Column, TopBar, BottomBar,
} from '../blocks';
import { AppScreen } from '../model';
import { assertNever } from '../utils';
import { BookScreenComp, BookScreenHeader, BookScreenFooter } from './BookScreenComp';
import { LibraryScreenComp, LibraryScreenHeader } from './LibraryScreenComp';

export type ScreenProps = {
    screen: AppScreen,
};
export const ScreenComp = connectState('controlsVisible', 'loading')<ScreenProps>(({ screen, controlsVisible, loading }) =>
    <Column centered fullWidth fullHeight>
        {loading ? <FullScreenActivityIndicator /> : null}
        <Header
            controlsVisible={controlsVisible}
            screen={screen}
        />
        <Footer
            controlsVisible={controlsVisible}
            screen={screen}
        />
        <Content screen={screen} />
    </Column>
);

type ContentProps = {
    screen: AppScreen,
};
function Content({ screen }: ContentProps) {
    return screen.screen === 'book' ? <BookScreenComp screen={screen} />
        : screen.screen === 'library' ? <LibraryScreenComp screen={screen} />
            : assertNever(screen);
}

type BarProps = {
    screen: AppScreen,
    controlsVisible: boolean,
};
function Header({ screen, controlsVisible }: BarProps) {
    return <TopBar open={controlsVisible}>
        {
            screen.screen === 'library' ? <LibraryScreenHeader />
                : screen.screen === 'book' ? <BookScreenHeader />
                    : assertNever(screen)
        }
    </TopBar>;
}

function Footer({ screen, controlsVisible }: BarProps) {
    if (screen.screen !== 'book') {
        return null;
    }

    return <BottomBar open={controlsVisible}>
        <BookScreenFooter screen={screen} />
    </BottomBar>;
}

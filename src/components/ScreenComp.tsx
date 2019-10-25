import * as React from 'react';
import { assertNever } from 'booka-common';

import { Column, point } from '../blocks';
import { AppScreen, Theme, User } from '../model';
import { BookScreenComp, BookScreenHeader, BookScreenFooter } from './BookScreenComp';
import { LibraryScreenComp, LibraryScreenHeader } from './LibraryScreenComp';
import {
    connectState,
    FullScreenActivityIndicator, TopBar, BottomBar,
} from './Connected';

export type ScreenProps = {
    screen: AppScreen,
};
export const ScreenComp = connectState('controlsVisible', 'loading', 'theme', 'user')<ScreenProps>(({ screen, controlsVisible, loading, theme, user }) =>
    <Column centered fullWidth fullHeight>
        {loading ? <FullScreenActivityIndicator /> : null}
        <Header
            theme={theme}
            user={user}
            controlsVisible={controlsVisible}
            screen={screen}
        />
        <Footer
            theme={theme}
            user={user}
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
            : (assertNever(screen), null);
}

type BarProps = {
    theme: Theme,
    user: User | undefined,
    screen: AppScreen,
    controlsVisible: boolean,
};
function Header({ screen, controlsVisible, theme, user }: BarProps) {
    return <TopBar open={controlsVisible} paddingHorizontal={point(1)}>
        {
            screen.screen === 'library' ? <LibraryScreenHeader theme={theme} user={user} />
                : screen.screen === 'book' ? <BookScreenHeader theme={theme} user={user} />
                    : assertNever(screen, () => null)
        }
    </TopBar>;
}

function Footer({ screen, controlsVisible }: BarProps) {
    if (screen.screen !== 'book') {
        return null;
    }

    return <BottomBar open={controlsVisible} paddingHorizontal={point(1)}>
        <BookScreenFooter screen={screen} />
    </BottomBar>;
}

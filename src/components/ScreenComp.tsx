import * as React from 'react';
import { assertNever } from 'booka-common';

import {
    Column, point,
    FullScreenActivityIndicator, TopBar, BottomBar,
} from '../blocks';
import { AppScreen, Theme, User, HasTheme, App } from '../model';
import { BookScreenComp, BookScreenHeader, BookScreenFooter } from './BookScreenComp';
import { LibraryScreenComp, LibraryScreenHeader } from './LibraryScreenComp';

export type ScreenProps = HasTheme & {
    screen: AppScreen,
} & Pick<App, 'controlsVisible' | 'loading' | 'user'>;
export function ScreenComp({
    screen, controlsVisible, loading, theme, user,
}: ScreenProps) {
    return <Column centered fullWidth fullHeight>
        {
            loading
                ? <FullScreenActivityIndicator theme={theme} />
                : null
        }
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
        <Content theme={theme} screen={screen} />
    </Column>;
}

type ContentProps = HasTheme & {
    screen: AppScreen,
};
function Content({ screen, theme }: ContentProps) {
    return screen.screen === 'book' ? <BookScreenComp theme={theme} screen={screen} />
        : screen.screen === 'library' ? <LibraryScreenComp theme={theme} screen={screen} />
            : (assertNever(screen), null);
}

type BarProps = {
    theme: Theme,
    user: User | undefined,
    screen: AppScreen,
    controlsVisible: boolean,
};
function Header({ screen, controlsVisible, theme, user }: BarProps) {
    return <TopBar
        theme={theme}
        open={controlsVisible}
        paddingHorizontal={point(1)}
    >
        {
            screen.screen === 'library' ? <LibraryScreenHeader theme={theme} user={user} />
                : screen.screen === 'book' ? <BookScreenHeader theme={theme} user={user} />
                    : assertNever(screen, () => null)
        }
    </TopBar>;
}

function Footer({ screen, controlsVisible, theme }: BarProps) {
    if (screen.screen !== 'book') {
        return null;
    }

    return <BottomBar
        theme={theme}
        open={controlsVisible}
        paddingHorizontal={point(1)}
    >
        <BookScreenFooter theme={theme} screen={screen} />
    </BottomBar>;
}

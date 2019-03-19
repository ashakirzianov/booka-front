import {
    ActionsTemplate, App, forScreen, updateRangeStart,
} from '../model';
import { buildPartialReducers } from './redux-utils';

export const reducer = buildPartialReducers<App, ActionsTemplate>({
    screen: {
        navigateToScreen: {
            pending: (current, loading) => loading,
            fulfilled: (current, next) => next,
        },
        updateCurrentBookPosition: (screen, bp) => forScreen(screen, {
            book: bs => ({
                ...bs,
                bl: updateRangeStart(bs.bl, bp),
            }),
            default: () => screen,
        }),
        toggleToc: screen => forScreen(screen, {
            book: bs => ({
                ...bs,
                tocOpen: !bs.tocOpen,
            }),
            default: () => screen,
        }),
    },
    pathToOpen: {
        navigateToScreen: {
            fulfilled: (path, screen) => forScreen(screen, {
                book: bs => bs.bl.range.start,
                default: () => null,
            }),
        },
    },
    controlsVisible: {
        toggleControls: (current, _) => !current,
        navigateToScreen: {
            pending: (_, screen) => forScreen(screen, {
                book: false,
                default: true,
            }),
        },
    },
});

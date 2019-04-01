import {
    ActionsTemplate, App, forScreen, updateRangeStart,
} from '../model';
import { buildPartialReducers } from './redux-utils';
import { updateBookPosition } from '../model/syncable';

export const reducer = buildPartialReducers<App, ActionsTemplate>({
    syncable: {
        updateBookPosition: (sync, bp) =>
            updateBookPosition(sync, bp),
    },
    theme: {
        setPalette: (theme, palette) => ({
            ...theme,
            currentPalette: palette,
        }),
        incrementScale: (theme, scaleIncrement) => theme.fontScale + scaleIncrement > 0
            ? { ...theme, fontScale: theme.fontScale + scaleIncrement }
            : theme,
    },
    screen: {
        navigateToScreen: {
            pending: (current, loading) => loading,
            fulfilled: (current, next) => next,
        },
        updateBookPosition: (screen, bp) => forScreen(screen, {
            book: bs => ({
                ...bs,
                bl: updateRangeStart(bs.bl, bp.path),
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
        openFootnote: (screen, fid) => forScreen(screen, {
            book: bs => ({
                ...bs,
                footnoteId: fid,
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

import {
    ActionsTemplate, App, forScreen, updateRangeStart,
} from '../model';
import { buildPartialReducers, LoopReducerT } from './redux-utils';
import { buildScreenForNavigation } from '../logic';

export function loopR<State, K extends keyof ActionsTemplate, S extends keyof ActionsTemplate>(red: LoopReducerT<State, ActionsTemplate, K, S, keyof ActionsTemplate>): LoopReducerT<State, ActionsTemplate, K, S, keyof ActionsTemplate> {
    return red;
}

export const reducer = buildPartialReducers<App, ActionsTemplate>({
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
        pushScreen: (curr, next) => next,
        navigate: loopR({
            sync: s => s,
            async: (s, no) => buildScreenForNavigation(no),
            success: 'pushScreen',
        }),
        updateBookPosition: (screen, bp) => forScreen(screen, {
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
        openFootnote: (screen, fid) => forScreen(screen, {
            book: bs => ({
                ...bs,
                footnoteId: fid,
            }),
            default: () => screen,
        }),
    },
    pathToOpen: {
        pushScreen: (path, screen) => forScreen(screen, {
            book: bs => bs.bl.range.start,
            default: () => null,
        }),
    },
    controlsVisible: {
        toggleControls: (current, _) => !current,
        pushScreen: (_, screen) => forScreen(screen, {
            book: false,
            default: true,
        }),
    },
});

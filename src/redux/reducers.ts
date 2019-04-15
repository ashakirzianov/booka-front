import { combineReducers, loop } from './redux-utils';
import { Action, actionCreators } from './actions';
import {
    App, forScreen, Theme, libraryScreen, library, AppScreen, locationPath,
} from '../model';
import { buildLibraryScreen, buildBookScreen } from '../core';
// TODO: remove this second-level import
import { restoreTheme } from '../core/persistent';

function theme(state: Theme | undefined = restoreTheme(), action: Action): Theme {
    switch (action.type) {
        case 'setPalette':
            return {
                ...state,
                currentPalette: action.payload,
            };
        case 'incrementScale':
            return state.fontScale + action.payload > 0
                ? { ...state, fontScale: state.fontScale + action.payload }
                : state;
        default:
            return state;
    }
}

const defaultScreen = libraryScreen(library());
export function screen(state: AppScreen | undefined = defaultScreen, action: Action) {
    switch (action.type) {
        case 'navigateToBook':
            return loop({
                state: state,
                async: () => buildBookScreen(action.payload),
                success: actionCreators.pushScreen,
            });
        case 'navigateToLibrary':
            return loop({
                state: state,
                async: buildLibraryScreen,
                success: actionCreators.pushScreen,
            });
        case 'pushScreen':
            return action.payload;
        case 'updateBookPosition':
            return forScreen(state, {
                book: bs => ({
                    ...bs,
                    bl: {
                        ...bs.bl,
                        location: locationPath(action.payload),
                    },
                }),
                default: () => state,
            });
        case 'toggleToc':
            return forScreen(state, {
                book: bs => ({
                    ...bs,
                    bl: {
                        ...bs.bl,
                        toc: !bs.bl.toc,
                    },
                }),
                default: () => state,
            });
        case 'openFootnote':
            // tslint:disable-next-line:no-console
            console.log('OPEN: ' + action.payload);
            return forScreen(state, {
                book: bs => ({
                    ...bs,
                    bl: {
                        ...bs.bl,
                        footnoteId: action.payload || undefined,
                    },
                }),
                default: () => state,
            });
        default:
            return state;
    }
}

function pathToOpen(state: App['pathToOpen'] | undefined = null, action: Action): App['pathToOpen'] {
    switch (action.type) {
        case 'pushScreen':
            const { payload } = action;
            if (payload.screen === 'book') {
                if (payload.bl.location.location === 'path') {
                    return payload.bl.location.path;
                } else if (payload.bl.quote) {
                    return payload.bl.quote.start;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        default:
            return state;
    }
}

function controlsVisible(state: boolean | undefined = false, action: Action): boolean {
    switch (action.type) {
        case 'pushScreen':
            return forScreen(action.payload, {
                book: false,
                default: () => true,
            });
        case 'toggleControls':
            return !state;
        default:
            return state;
    }
}

function loading(state: boolean | undefined = false, action: Action) {
    switch (action.type) {
        case 'navigateToBook':
        case 'navigateToLibrary':
            return true;
        case 'pushScreen':
            return false;
        default:
            return state;
    }
}

export const reducer = combineReducers<App, Action>({
    theme,
    screen,
    pathToOpen,
    controlsVisible,
    loading,
});

import {
    App, forScreen, updatePath, Theme, libraryScreen, library, AppScreen,
} from '../model';
import { buildScreenForNavigation } from '../logic';
import { combineReducers, loop } from './redux-utils';
import { Action, actionCreators } from './actions';

const defaultTheme: Theme = {
    palettes: {
        light: {
            text: '#000',
            primary: '#fff',
            secondary: '#eee',
            accent: '#777',
            highlight: '#aaf',
            shadow: '#000',
        },
        sepia: {
            text: '#5f3e24',
            primary: '#f9f3e9',
            secondary: '#e6e0d6',
            accent: '#987',
            highlight: '#321',
            shadow: '#000',
        },
        dark: {
            text: '#999',
            primary: '#000',
            secondary: '#222',
            accent: '#ddd',
            highlight: '#fff',
            shadow: '#555',
        },
    },
    currentPalette: 'light',
    fontFamily: 'Georgia',
    fontSize: {
        normal: 26,
        large: 30,
        largest: 36,
    },
    fontScale: 1,
    radius: 9,
};

function theme(state: Theme | undefined = defaultTheme, action: Action): Theme {
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
        case 'navigate':
            return loop({
                state: state,
                async: () => buildScreenForNavigation(action.payload),
                success: actionCreators.pushScreen,
            });
        case 'pushScreen':
            return action.payload;
        case 'updateBookPosition':
            return forScreen(state, {
                book: bs => ({
                    ...bs,
                    bl: updatePath(bs.bl, action.payload),
                }),
                default: () => state,
            });
        case 'toggleToc':
            return forScreen(state, {
                book: bs => ({
                    ...bs,
                    tocOpen: !bs.tocOpen,
                }),
                default: () => state,
            });
        case 'openFootnote':
            return forScreen(state, {
                book: bs => ({
                    ...bs,
                    footnoteId: action.payload,
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
            return forScreen(action.payload, {
                book: bs => bs.bl.path,
                default: () => null,
            });
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

export const reducer = combineReducers<App, Action>({
    theme: theme,
    screen,
    pathToOpen,
    controlsVisible,
});

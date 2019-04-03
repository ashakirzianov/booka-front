import {
    App, forScreen, updateRangeStart, Theme, libraryScreen, library, Screen, ActionsTemplate,
} from '../model';
import { Action } from './store';
import { combineReducers, LoopReducer } from 'redux-loop';
import { Reducer } from 'redux';
import { buildScreenForNavigation } from '../logic';
import { buildLoop } from './redux-utils';

const loop = buildLoop<ActionsTemplate>();

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

function themeReducer(theme: Theme | undefined = defaultTheme, action: Action): Theme {
    switch (action.type) {
        case 'setPalette':
            return {
                ...theme,
                currentPalette: action.payload,
            };
        case 'incrementScale':
            return theme.fontScale + action.payload > 0
                ? { ...theme, fontScale: theme.fontScale + action.payload }
                : theme;
        default:
            return theme;
    }
}

const defaultScreen = libraryScreen(library());
export function screenReducer(screen: Screen | undefined = defaultScreen, action: Action): Screen {
    switch (action.type) {
        case 'navigate':
            return loop({
                state: screen,
                async: () => buildScreenForNavigation(action.payload),
                success: 'pushScreen',
            });
        case 'pushScreen':
            return action.payload;
        case 'updateBookPosition':
            return forScreen(screen, {
                book: bs => ({
                    ...bs,
                    bl: updateRangeStart(bs.bl, action.payload),
                }),
                default: () => screen,
            });
        case 'toggleToc':
            return forScreen(screen, {
                book: bs => ({
                    ...bs,
                    tocOpen: !bs.tocOpen,
                }),
                default: () => screen,
            });
        case 'openFootnote':
            return forScreen(screen, {
                book: bs => ({
                    ...bs,
                    footnoteId: action.payload,
                }),
                default: () => screen,
            });
        default:
            return screen;
    }
}

function pathToOpenReducer(path: App['pathToOpen'] | undefined = null, action: Action): App['pathToOpen'] {
    switch (action.type) {
        case 'pushScreen':
            return forScreen(action.payload, {
                book: bs => bs.bl.range.start,
                default: () => null,
            });
        default:
            return path;
    }
}

function controlsVisibleReducer(cv: boolean | undefined = false, action: Action): boolean {
    switch (action.type) {
        case 'pushScreen':
            return forScreen(action.payload, {
                book: false,
                default: () => true,
            });
        case 'toggleControls':
            return !cv;
        default:
            return cv;
    }
}

export const reducer = combineReducers<App, Action>({
    // TODO: remove casts after 'redux-loop' improve typings
    theme: themeReducer as LoopReducer<Theme, Action>,
    screen: screenReducer as LoopReducer<Screen, Action>,
    pathToOpen: pathToOpenReducer as LoopReducer<App['pathToOpen'], Action>,
    controlsVisible: controlsVisibleReducer as LoopReducer<boolean, Action>,
}) as any as Reducer<App, Action>;

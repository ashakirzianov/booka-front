import {
    readValue,
    // storeValue,
} from './persistentStore.platform';
import { App, libraryScreen, library, Theme } from '../model';

const storeKey = 'state';
export function storeState(state: App) {
    // storeValue(storeKey, state);
}

export function initialState(): App {
    return validateState(restoreState()) || createNewState();
}

function restoreState(): object | undefined {
    return readValue(storeKey);
}

function validateState(restored: object | undefined): App | undefined {
    return undefined; // TODO: implement
}

export const lightTheme: Theme = {
    fontFamily: 'Georgia',
    palette: {
        foreground: '#5f3e24',
        background: '#f9f3e9',
        secondBack: '#e6e0d6',
        accent: '#987',
        highlight: '#321',
        shadow: '#000',
    },
    fontSize: {
        normal: 26,
        large: 30,
        largest: 36,
    },
    fontScale: 1,
    radius: 9,
};
export const darkTheme: Theme = {
    fontFamily: 'Georgia',
    palette: {
        foreground: '#999',
        background: '#000',
        secondBack: '#222',
        accent: '#ddd',
        highlight: '#fff',
        shadow: '#222',
    },
    fontSize: {
        normal: 26,
        large: 30,
        largest: 36,
    },
    fontScale: 1,
    radius: 9,
};
const defaultTheme: Theme = lightTheme;

function createNewState(): App {
    return {
        screen: libraryScreen(library()),
        pathToOpen: null,
        controlsVisible: true,
        theme: defaultTheme,
    };
}

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

// TODO: remove
const defaultTheme: Theme = {
    fontFamily: 'Georgia',
    color: {
        foreground: '#999999',
        background: '#000000',
        secondBack: '#222222',
        accent: '#9999DD',
        highlight: '#DD99DD',
    },
    fontSize: {
        normal: 26,
        large: 30,
        largest: 36,
    },
    radius: 9,
};

function createNewState(): App {
    return {
        screen: libraryScreen(library()),
        pathToOpen: null,
        controlsVisible: true,
        theme: defaultTheme,
    };
}

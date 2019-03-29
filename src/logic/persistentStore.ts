import {
    readValue,
    // storeValue,
} from './persistentStore.platform';
import { App, libraryScreen, library, defaultTheme, defaultPaletteName } from '../model';

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

function createNewState(): App {
    return {
        screen: libraryScreen(library()),
        pathToOpen: null,
        controlsVisible: true,
        theme: defaultTheme,
        palette: defaultPaletteName,
    };
}

import {
    readValue,
    // storeValue,
} from './persistentStore.platform';
import { App, emptyStack } from "../model";

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
        screenStack: emptyStack(),
        positionToNavigate: null,
    };
}

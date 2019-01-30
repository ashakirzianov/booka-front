import { App, libraryScreen, noBook, library } from "../model";
import { persistentStore } from './persistentStore';

export type State = App;

export function storeState(state: State) {
    persistentStore.setState(state);
}

export function restoreState(): State | undefined {
    return persistentStore.readState();
}

export function initialState(): State {
    return validateState(restoreState()) || createNewState();
}

function validateState(restored: State | undefined) {
    return undefined;
}

function createNewState(): State {
    return {
        screenStack: [libraryScreen()],
        currentBook: noBook(),
        library: library({
            wap: {
                title: 'War & Peace',
            },
        }),
    };
}

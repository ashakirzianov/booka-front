import { implementation } from './persistentStore.platform';
import { App, libraryScreen, noBook, library } from "../model";

type State = App;
export type PersistentStore = {
    setState(value: State): void,
    readState(): State | undefined,
};

const persistentStore: PersistentStore = implementation;

export function storeState(state: State) {
    persistentStore.setState(state);
}

export function initialState(): State {
    return validateState(restoreState()) || createNewState();
}

function restoreState(): State | undefined {
    return persistentStore.readState();
}

function validateState(restored: State | undefined) {
    return undefined; // TODO: implement
}

function createNewState(): State {
    return {
        screenStack: [libraryScreen()],
        currentBook: noBook(),
        library: library({
            wap: { title: 'War & Peace' },
            capital: { title: 'Das Kapital' },
        }),
    };
}

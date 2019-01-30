// import * as store from "store";
import { App, libraryScreen, noBook, library } from "../model";

export type State = App;

export function storeState(state: State) {
    // store.set("state", state);
}

export function restoreState(): State | undefined {
    // return store.get("state") as State;
    return undefined;
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

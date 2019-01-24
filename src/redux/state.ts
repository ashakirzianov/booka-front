import * as store from "store";
import { App, libraryScreen, loading } from "../model";

export type State = App;

export function storeState(state: State) {
    store.set("state", state);
}

export function restoreState(): State | undefined {
    return store.get("state") as State;
}

export function initialState(): State {
    return validateState(restoreState()) || createNewState();
}

function validateState(restored: State | undefined) {
    return undefined;
}

function createNewState(): State {
    return {
        screen: libraryScreen(loading()),
    };
}

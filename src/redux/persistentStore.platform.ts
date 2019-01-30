import * as store from "store";
import { State } from './state';

export const implementation = {
    setState(state: State) {
        store.set('state', state);
    },

    readState(): State | undefined {
        return store.get('state') as State;
    },
}

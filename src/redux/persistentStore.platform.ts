import * as store from "store";
import { App } from '../model';

export const implementation = {
    setState(state: App) {
        store.set('state', state);
    },

    readState(): App | undefined {
        return store.get('state') as App;
    },
}

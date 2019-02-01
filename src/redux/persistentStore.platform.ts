import * as store from "store";
import { App } from '../model';
import { PersistentStore } from './state';

export const implementation: PersistentStore = {
    setState(state: App) {
        store.set('state', state);
    },

    readState(): App | undefined {
        return store.get('state') as App;
    },
}

import { App } from '../model';
import { PersistentStore } from './state';

// TODO: implement
export const implementation: PersistentStore = {
    setState(state: App) {},
    readState(): App | undefined {
        return undefined;
    },
}

import { State } from './state';
import { implementation } from './persistentStore.platform';

export type PersistentStore = {
    setState(value: State): void,
    readState(): State | undefined,
};

export const persistentStore: PersistentStore = implementation;

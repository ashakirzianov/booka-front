import * as store from 'store';
import { values } from './misc';

export function smartStore<V>(key: string) {
    type K = string;
    type Cache = {
        [k in K]?: V;
    };
    const cache: Cache = store.get(key) || {};
    return {
        all() {
            return { ...cache };
        },

        find(f: (x: V) => boolean): V | undefined {
            const vs = values(cache);
            return vs.find(f);
        },

        get(k: K): V | undefined {
            return cache[k];
        },

        set(k: K, value: V) {
            cache[k] = value;
            store.set(key, cache);
        },

        clear() {
            store.set(key, undefined);
        },
    };
}

export function singleValueStore<V extends object>(key: string) {
    return {
        get(): V | undefined {
            return store.get(key) as any;
        },
        set(v: V) {
            store.set(key, v);
        },
        clear() {
            store.set(key, undefined);
        },
    };
}

export function clearAllStores() {
    store.clearAll();
}

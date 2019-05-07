import * as store from 'store';
import { values } from './misc';
import { log } from './debug';

export function smartStore<V>(key: string) {
    type K = string;
    type Cache = {
        [k in K]?: V;
    };
    let cache: Cache = store.get(key) as any || {};
    return {
        all() {
            return { ...cache };
        },

        find(f: (x: V) => boolean): V | undefined {
            const vs = values(cache);
            return vs.find(f);
        },

        get(k: K): V | undefined {
            return undefined; // cache[k];
        },

        set(k: K, value: V) {
            cache[k] = value;
            try {
                store.set(key, cache);
            } catch {
                log(`Couldn't add ${key}: '${k}'`);
                store.remove(key);
                cache = { [k]: value };
                try {
                    store.set(key, cache);
                } catch {
                    log(`Store is too small for ${key}: '${k}'`);
                }
            }
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

const versionKey = '@version';
const version = 4;
export function validatePersistentStorage() {
    const v = store.get(versionKey);
    if (v !== version) {
        clearAllStores();
        store.set(versionKey, version);
    }
}

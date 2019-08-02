import * as store from 'store';
import { values } from './misc';
import { config } from '../config';

const {
    logger: log,
    usePersistentStorage: useStore,
} = config();

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
            // return cache[k];
            return useStore
                ? cache[k]
                : undefined;
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

export function singleValueStore<V extends object | string>(key: string) {
    return {
        get(): V | undefined {
            return useStore
                ? store.get(key) as any
                : undefined;
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
const version = 5;
export function validatePersistentStorage() {
    const v = store.get(versionKey);
    if (v !== version) {
        clearAllStores();
        store.set(versionKey, version);
    }
}

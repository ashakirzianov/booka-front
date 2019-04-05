import * as store from 'store';

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

        get(k: K): V | undefined {
            return cache[k];
        },

        set(k: K, value: V) {
            cache[k] = value;
            store.set(key, cache);
        },
    };
}

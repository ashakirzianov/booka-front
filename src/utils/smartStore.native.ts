// TODO: implement

export function smartStore<V>(key: string) {
    type K = string;
    return {
        all() {
            return {};
        },

        find(f: (x: V) => boolean): V | undefined {
            return undefined;
        },

        get(k: K): V | undefined {
            return undefined;
        },

        set(k: K, value: V) {
            return;
        },

        clear() {
            return;
        },
    };
}

export function singleValueStore<V extends object>(key: string) {
    return {
        get(): V | undefined {
            return undefined;
        },
        set(v: V) {
            return;
        },
        clear() {
            return;
        },
    };
}

export function clearAllStores() {
    return;
}

export function validatePersistentStorage() {
    return;
}

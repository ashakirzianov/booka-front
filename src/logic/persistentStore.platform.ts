import * as store from 'store';

export function storeValue(key: string, value: object) {
    store.set(key, value);
}

export function readValue(key: string): object | undefined {
    return store.get(key);
}

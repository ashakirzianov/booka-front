declare module 'store' {
    type StoreType = object | number | string;
    interface Store {
        get(key: string): StoreType | undefined;
        set(key: string, value: StoreType | undefined): void;
        remove(key: string): void;
        clearAll(): void;
        each(f: (key: string, value: StoreType) => void): void;
    }

    const store: Store;
    export = store;
}

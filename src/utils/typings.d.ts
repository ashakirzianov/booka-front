declare module 'store' {
    interface Store {
        get(key: string): object | undefined;
        set(key: string, value: object | undefined): void;
        remove(key: string): void;
        clearAll(): void;
        each(f: (key: string, value: object) => void): void;
    }

    const store: Store;
    export = store;
}

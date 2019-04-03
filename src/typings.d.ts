declare module 'store' {
    interface Store {
        get(key: string): object | undefined;
        set(key: string, value: object): void;
        remove(key: string): void;
        clearAll(): void;
        each(f: (key: string, value: object) => void): void;
    }

    const store: Store;
    export = store;
}

// TODO: fix after TypeScript 3.4
// see more: https://github.com/Microsoft/TypeScript/issues/21592
declare module 'redux-loop' {
    const all: any;
    export = all;
}

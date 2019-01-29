import { BookMeta } from "./book";

export type Library = {
    loading: boolean,
    books: {
        [key: string]: BookMeta | undefined;
    },
};

export function library(books: Library['books'] = {}): Library {
    return {
        loading: false,
        books: books,
    };
}

export function loadingLibrary(): Library {
    return {
        loading: true,
        books: {},
    };
}

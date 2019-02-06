export type BookInfo = {
    title: string,
    author?: string,
};

export type Library = {
    loading: boolean,
    books: {
        [key: string]: BookInfo | undefined;
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

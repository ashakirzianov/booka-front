export type BookInfo = {
    title: string,
    author?: string,
};

export type Library = {
    books: {
        [key: string]: BookInfo | undefined;
    },
};

export function library(books: Library['books'] = {}): Library {
    return {
        books: books,
    };
}

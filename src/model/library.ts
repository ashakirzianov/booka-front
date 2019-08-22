export type BookDesc = {
    title: string,
    author?: string,
    coverUrl?: string,
};

export type Library = {
    books: {
        [key: string]: BookDesc | undefined;
    },
};

export function library(books: Library['books'] = {}): Library {
    return {
        books: books,
    };
}

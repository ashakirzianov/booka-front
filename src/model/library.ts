import { BookMeta } from "./book";

export type Library = {
    books: {
        [key: string]: BookMeta | undefined;
    },
};

export function library(books: Library['books'] = {}): Library {
    return {
        books: books,
    };
}

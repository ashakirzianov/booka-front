import { BookMeta } from "./book";

export type Library = {
    books: {
        [key: string]: BookMeta | undefined;
    },
};

export function emptyLibrary(): Library {
    return {
        books: {},
    };
}

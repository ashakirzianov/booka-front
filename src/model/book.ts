import { BookLocator, noBookLocator, errorBookLocator } from './bookLocator';

export type Paragraph = string;
export type Chapter = {
    book: "chapter",
    level: number,
    title?: string,
    content: BookNode[],
};

export type BookNode = Chapter | Paragraph;

export type BookMeta = {
    title: string,
    author?: string,
};

export type ActualBook = {
    book: "book",
    locator: BookLocator,
    meta: BookMeta,
    content: BookNode[],
};

export type NoBook = {
    book: 'no-book',
    locator: BookLocator,
};

export type ErrorBook = {
    book: 'error',
    locator: BookLocator,
    error: string,
};

export type Book = ActualBook | NoBook | ErrorBook;

export function noBook(): NoBook {
    return {
        book: 'no-book',
        locator: noBookLocator(),
    };
}

export function errorBook(error: string): ErrorBook {
    return {
        book: 'error',
        locator: errorBookLocator(),
        error: error,
    };
}

// Type guards:

export function isParagraph(bn: BookNode): bn is Paragraph {
    return typeof bn === 'string';
}

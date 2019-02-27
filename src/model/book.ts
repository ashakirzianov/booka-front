import { BookId } from './bookLocator';

export type BookMeta = {
    title: string,
    author?: string,
};

export type Paragraph = string;
export type Chapter = {
    book: 'chapter',
    level: number,
    title?: string,
    content: BookNode[],
};

export type BookNode = Chapter | Paragraph;

export type ActualBook = {
    book: 'book',
    id: BookId,
    meta: BookMeta,
    content: BookNode[],
};

export type ErrorBook = {
    book: 'error',
    id: BookId,
    error: string,
};

export type LoadingBook = {
    book: 'loading',
    id: BookId,
};

export type Book = ActualBook | ErrorBook | LoadingBook;

export function loadingBook(id: BookId): LoadingBook {
    return {
        book: 'loading',
        id,
    };
}

export function errorBook(error: string): ErrorBook {
    return {
        book: 'error',
        id: { bi: 'not-book' },
        error: error,
    };
}

// Type guards:

export function isParagraph(bn: BookNode): bn is Paragraph {
    return typeof bn === 'string';
}

export function isChapter(bn: BookNode): bn is Chapter {
    return typeof bn === 'object' && bn.book === 'chapter';
}

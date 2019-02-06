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
    meta: BookMeta,
    content: BookNode[],
};

export type NoBook = {
    book: 'no-book',
};

export type ErrorBook = {
    book: 'error',
    error: string,
};

export type LoadingBook = {
    book: 'loading',
};

export type Book = ActualBook | NoBook | ErrorBook | LoadingBook;

export function loadingBook(): LoadingBook {
    return {
        book: 'loading',
    };
}

export function noBook(): NoBook {
    return {
        book: 'no-book',
    };
}

export function errorBook(error: string): ErrorBook {
    return {
        book: 'error',
        error: error,
    };
}

// Type guards:

export function isParagraph(bn: BookNode): bn is Paragraph {
    return typeof bn === 'string';
}

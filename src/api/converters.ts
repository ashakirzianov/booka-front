import * as Contracts from './contracts';
import { Library, BookId, LoadedBook } from '../model';
import { tocFromContent } from '../model/tableOfContent';

export function convertLibrary(lib: Contracts.Library): Library {
    return {
        loading: false,
        books: lib,
    };
}

export function convertBook(book: Contracts.ActualBook, id: BookId): LoadedBook {
    return {
        book: 'book',
        content: book,
        id,
        toc: tocFromContent(book, id),
    };
}

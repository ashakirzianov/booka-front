import * as Contracts from '../contracts';
import { Library, BookId, Book, tocFromContent } from '../model';

export function convertLibrary(lib: Contracts.Library): Library {
    return {
        books: lib,
    };
}

export function convertBook(book: Contracts.BookContent, id: BookId): Book {
    return {
        content: book,
        id,
        toc: tocFromContent(book, id),
    };
}

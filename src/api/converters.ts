import { Library, BookId, BookObject } from '../model';
import { Book, BookDesc, tocForBook } from 'booka-common';

export function convertLibrary(infos: BookDesc[]): Library {
    return {
        books: infos.reduce((current, bi) => {
            current[bi.id] = {
                title: bi.title,
                author: bi.author,
                coverUrl: bi.cover,
            };
            return current;
        }, {} as Library['books']),
    };
}

export function convertBook(book: Book, id: BookId): BookObject {
    return {
        book: book,
        id,
        toc: tocForBook(book),
    };
}

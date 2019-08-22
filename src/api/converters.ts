import { Library, BookId, Book, tocFromVolume } from '../model';
import { BookCollection, BookObject } from 'booka-common';

export function convertLibrary(lib: BookCollection): Library {
    return {
        books: lib.books.reduce((current, bi) => {
            current[bi.id] = {
                title: bi.title,
                author: bi.author,
                coverUrl: bi.cover,
            };
            return current;
        }, {} as Library['books']),
    };
}

export function convertBook(bookObject: BookObject, id: BookId): Book {
    return {
        volume: bookObject.volume,
        id,
        toc: tocFromVolume(bookObject.volume, id),
        idDictionary: bookObject.idDictionary,
    };
}

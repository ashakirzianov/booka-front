import { Library, BookId, BookObject, tocFromVolume } from '../model';
import { Book, BookInfo } from 'booka-common';

export function convertLibrary(infos: BookInfo[]): Library {
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

export function convertBook(bookObject: Book, id: BookId): BookObject {
    return {
        volume: bookObject.volume,
        id,
        toc: tocFromVolume(bookObject.volume, id),
    };
}

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

export function convertBook(book: Book, id: BookId): BookObject {
    return {
        book: book,
        id,
        toc: tocFromVolume(book.volume, id),
    };
}

import * as Contracts from '../backContract';
import {
    Library, BookId, Book, tocFromVolume,
    VolumeNode,
} from '../model';

export function convertLibrary(lib: Contracts.BookCollection): Library {
    return {
        books: lib.books.reduce((current, bi) => {
            current[bi.id] = {
                title: bi.title,
                author: bi.author,
            };
            return current;
        }, {} as Library['books']),
    };
}

export function convertBook(volume: VolumeNode, id: BookId): Book {
    return {
        volume,
        id,
        toc: tocFromVolume(volume, id),
    };
}

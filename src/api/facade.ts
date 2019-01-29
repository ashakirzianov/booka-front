import { BookLocator, Book } from '../model';
import { fetchBL, fetchLibrary } from './fetch';
import { PromisePlus, promisePlus } from '../promisePlus';

export const facade = {
    bookForLocator(bookLocator: BookLocator): PromisePlus<Book, BookLocator> {
        return promisePlus(fetchBL(bookLocator), bookLocator);
    },

    library: fetchLibrary,
}

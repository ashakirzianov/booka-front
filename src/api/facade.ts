import { BookLocator, Book, fakeBook } from '../model';
import { fetchBL, fetchLibrary } from './fetch';
import { OptimisticPromise, optimisticPromise } from '../promisePlus';

export const facade = {
    bookForLocator(bookLocator: BookLocator): OptimisticPromise<Book> {
        return optimisticPromise(fetchBL(bookLocator), fakeBook(bookLocator));
    },

    library: fetchLibrary,
}

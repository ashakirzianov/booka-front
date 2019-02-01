import { BookLocator, Book, loadingBook, Library, loadingLibrary } from '../model';
import { fetchBL, fetchLibrary } from './fetch';
import { OptimisticPromise, optimisticPromise } from '../promisePlus';
import { timeouted } from '../utils';

export const realFacade = {
    bookForLocator(bookLocator: BookLocator): OptimisticPromise<Book> {
        return optimisticPromise(fetchBL(bookLocator), loadingBook(bookLocator));
    },

    library(): OptimisticPromise<Library> {
        return optimisticPromise(fetchLibrary(), loadingLibrary());
    },
}

export const fakeFacade: typeof realFacade = {
    bookForLocator(bookLocator: BookLocator): OptimisticPromise<Book> {
        return optimisticPromise(
            timeouted(fakeBook)(bookLocator),
            loadingBook(bookLocator),
        );
    },

    library(): OptimisticPromise<Library> {
        return optimisticPromise(
            timeouted(fakeLibrary)(),
            loadingLibrary(),
        );
    },
}

function fakeBook(bookLocator: BookLocator): Book {
    return {
        book: 'book',
        meta: {
            title: 'Fake book',
        },
        locator: bookLocator,
        content: [
            "Only one paragraph",
        ],
    };
}

function fakeLibrary(): Library {
    return {
        loading: false,
        books: {
            wap: { title: 'War & Peace' },
            capital: { title: 'Das Kapital' },
        },
    };
}

export const facade = realFacade;

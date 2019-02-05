import {
    BookLocator, loadingBook, loadingLibrary, BookScreen, bookScreen, LibraryScreen, libraryScreen,
} from '../model';
import { fetchBL, fetchLibrary } from './fetch';
import { OptimisticPromise, optimisticPromise } from '../promisePlus';

export const realFacade = {
    bookScreen(bl: BookLocator): OptimisticPromise<BookScreen> {
        const screen = fetchBL(bl)
            .then(b => bookScreen(b, bl));
        const loading = bookScreen(loadingBook(bl), bl);

        return optimisticPromise(screen, loading);
    },

    libraryScreen(): OptimisticPromise<LibraryScreen> {
        const screen = fetchLibrary()
            .then(l => (libraryScreen(l)));
        const loading = libraryScreen(loadingLibrary());

        return optimisticPromise(screen, loading);
    }
};

export const facade = realFacade;

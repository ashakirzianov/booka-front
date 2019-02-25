import {
    BookLocator, bookScreen, libraryScreen, Screen, tocScreen, loadingScreen,
} from '../model';
import { bookForId, currentLibrary, cachedLibrary } from './dataAccess';
import { tocFromBook } from '../model/tableOfContent';
import { OptimisticPromise, optimisticPromise } from '../promisePlus';

export function buildBookScreen(bl: BookLocator): OptimisticPromise<Screen> {
    const guess = loadingScreen();
    const promise = bookForId(bl.id)
        .then(book => bookScreen(book, bl));

    return optimisticPromise<Screen>(guess, promise);
}

export function buildLibraryScreen(): OptimisticPromise<Screen> {
    const guess = libraryScreen(cachedLibrary());
    const promise = currentLibrary().then(libraryScreen);

    return optimisticPromise<Screen>(guess, promise);
}

export function buildTocScreen(bl: BookLocator): OptimisticPromise<Screen> {
    const guess = loadingScreen();
    const promise = bookForId(bl.id)
        .then(book => tocScreen(tocFromBook(book), bl));

    return optimisticPromise<Screen>(guess, promise);
}

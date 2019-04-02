import {
    BookLocator, bookScreen, libraryScreen, Screen, BookId, Book, Library, loadingBook, bookLocator,
} from '../model';
import { bookForId, currentLibrary, cachedLibrary } from './dataAccess';
import { OptimisticPromise, optimisticPromise, then } from '../promisePlus';
import { ToBook, ToLibrary, NavigationObject } from './navigationObject';
import { assertNever } from '../utils';

function optimisticBook(id: BookId): OptimisticPromise<Book> {
    const guess = loadingBook(id);
    const promise = bookForId(id);

    return optimisticPromise<Book>(guess, promise);
}

function optimisticLibrary(): OptimisticPromise<Library> {
    const guess = cachedLibrary();
    const promise = currentLibrary();

    return optimisticPromise<Library>(guess, promise);
}

function buildBookScreen(navigation: ToBook): OptimisticPromise<Screen> {
    const promise = optimisticBook(navigation.id);
    const bl = navigation.location.location === 'static'
        ? bookLocator(navigation.id, navigation.location.path)
        : bookLocator(navigation.id);

    return then(promise, book => bookScreen(book, bl, navigation.toc, navigation.footnoteId));
}

function buildLibraryScreen(): OptimisticPromise<Screen> {
    const promise = optimisticLibrary();

    return then(promise, lib => libraryScreen(lib));
}

export function buildScreenForNavigation(navigation: NavigationObject): OptimisticPromise<Screen> {
    switch (navigation.navigate) {
        case 'book':
            return buildBookScreen(navigation);
        case 'default':
        case 'library':
        case 'unknown':
            // TODO: report errors
            return buildLibraryScreen();
        default:
            return assertNever(navigation);
    }
}

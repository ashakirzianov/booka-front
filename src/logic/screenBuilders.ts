import {
    bookScreen, libraryScreen, Screen, Library, loadingBook, bookLocator,
} from '../model';
import { bookForId, currentLibrary, cachedLibrary, currentPosition } from './dataAccess';
import { OptimisticPromise, optimisticPromise, then } from '../promisePlus';
import { ToBook, NavigationObject } from './navigationObject';
import { assertNever } from '../utils';

function optimisticLibrary(): OptimisticPromise<Library> {
    const guess = cachedLibrary();
    const promise = currentLibrary();

    return optimisticPromise<Library>(guess, promise);
}

function buildBookScreen(navigation: ToBook): OptimisticPromise<Screen> {
    const book = bookForId(navigation.id);
    const path = navigation.location.location === 'static'
        ? Promise.resolve(navigation.location.path || [])
        : currentPosition(navigation.id);

    const promise = Promise.all([book, path]).then(([b, p]) =>
        bookScreen(b, bookLocator(navigation.id, p), navigation.toc, navigation.footnoteId));

    const guess = bookScreen(loadingBook(navigation.id), bookLocator(navigation.id));

    return optimisticPromise(guess, promise);
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

import {
    BookLocator, bookScreen, libraryScreen, Screen, tocScreen, BookId, Book, Library, loadingBook,
} from '../model';
import { bookForId, currentLibrary, cachedLibrary } from './dataAccess';
import { tocFromBook } from '../model/tableOfContent';
import { OptimisticPromise, optimisticPromise, then } from '../promisePlus';

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

export function buildBookScreen(bl: BookLocator): OptimisticPromise<Screen> {
    const promise = optimisticBook(bl.id);

    return then(promise, book => bookScreen(book, bl));
}

export function buildLibraryScreen(): OptimisticPromise<Screen> {
    const promise = optimisticLibrary();

    return then(promise, lib => libraryScreen(lib));
}

export function buildTocScreen(bl: BookLocator): OptimisticPromise<Screen> {
    const promise = optimisticBook(bl.id);

    return then(promise, book => tocScreen(tocFromBook(book), bl));
}

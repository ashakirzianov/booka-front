import {
    BookLocator, bookScreen, libraryScreen, Screen, BookId, Book, Library, loadingBook,
} from '../model';
import { bookForId, currentLibrary, cachedLibrary } from './dataAccess';
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

export function buildBookScreen(bl: BookLocator, tocOpen?: boolean, footnoteId?: string): OptimisticPromise<Screen> {
    const promise = optimisticBook(bl.id);

    return then(promise, book => bookScreen(book, bl, tocOpen, footnoteId));
}

export function buildLibraryScreen(): OptimisticPromise<Screen> {
    const promise = optimisticLibrary();

    return then(promise, lib => libraryScreen(lib));
}

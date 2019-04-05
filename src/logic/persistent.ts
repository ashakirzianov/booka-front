// import * as store from 'store';
import {
    BookId, BookPath, library, LoadedBook,
    Library, App, BookInfo,
} from '../model';
import { Action } from '../redux';
import { Middleware } from 'redux';
import { smartStore, forEach } from '../utils';

const stores = {
    books: smartStore<LoadedBook>('books'),
    library: smartStore<BookInfo>('library'),
    positions: smartStore<BookPath>('positions'),
};

export function bookFromStore(bi: BookId): LoadedBook | undefined {
    return stores.books.get(bi.name);
}

export function storeBook(book: LoadedBook) {
    stores.books.set(book.id.name, book);
}

export function cachedLibrary(): Library {
    return library(stores.library.all());
}

export function cacheLibrary(lib: Library) {
    forEach(lib.books, (id, info) => stores.library.set(id, info));
}

export async function resolveCurrentPosition(bi: BookId): Promise<BookPath> {
    return stores.positions.get(bi.name) || [];
}

export function setCurrentPosition(bookId: BookId, path: BookPath) {
    stores.positions.set(bookId.name, path);
}

export const syncMiddleware: Middleware<{}, App> = store => next => actionAny => {
    const result = next(actionAny);
    const action = actionAny as Action;
    if (action.type === 'updateBookPosition') {
        const position = action.payload;
        const state = store.getState();
        const id = state.screen.screen === 'book'
            ? state.screen.book.id
            : undefined;
        if (id) {
            setCurrentPosition(id, position);
        }
    }
    return result;
};

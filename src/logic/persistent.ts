// import * as store from 'store';
import {
    BookId, BookPath, sameId, library, LoadedBook,
    Library, App,
} from '../model';
import { Action } from '../redux';
import { Middleware } from 'redux';

type BookStore = LoadedBook[];
const bookStore: BookStore = [];
export function bookFromStore(bi: BookId): LoadedBook | undefined {
    const book = bookStore.find(b => sameId(b.id, bi));

    return book;
}

export function storeBook(book: LoadedBook) {
    const index = bookStore.findIndex(b => sameId(b.id, book.id));

    if (index >= 0) {
        bookStore[index] = book;
    } else {
        bookStore.push(book);
    }
}

let libraryCache = library();
export function cachedLibrary() {
    return libraryCache;
}

export function cacheLibrary(lib: Library) {
    libraryCache = lib;
}

type BookPositionStore = {
    [bi in string]?: BookPath;
};
const currentPositionStore: BookPositionStore = {};

export async function positionStore(): Promise<BookPositionStore> {
    return currentPositionStore;
}

export function setCurrentPosition(bookId: BookId, path: BookPath) {
    currentPositionStore[bookId.name] = path;
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

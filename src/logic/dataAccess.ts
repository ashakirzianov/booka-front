import {
    Book, Library, library, BookId, sameId, BookPath, App, BookPositionStore,
} from '../model';
import { fetchBI, fetchLibrary, convertBook, convertLibrary } from '../api';
import { Middleware } from 'redux';
import { Action } from '../redux/actions';

type BookStore = Book[];
const bookStore: BookStore = [];
function bookFromStore(store: BookStore, bi: BookId): Book | undefined {
    const book = store.find(b => sameId(b.id, bi));

    return book;
}

function storeBook(store: BookStore, book: Book) {
    const index = store.findIndex(b => sameId(b.id, book.id));

    if (index >= 0) {
        store[index] = book;
    } else {
        store.push(book);
    }
}

export async function bookForId(bi: BookId): Promise<Book> {
    const book = bookFromStore(bookStore, bi);
    if (book) {
        return book;
    }

    const bookPromise = fetchBI(bi).then(b => {
        const converted = convertBook(b, bi);
        storeBook(bookStore, converted);
        return converted;
    });

    return bookPromise;
}

let libraryCache = library();
export async function currentLibrary(): Promise<Library> {
    const lib = fetchLibrary()
        .then(l => {
            const converted = convertLibrary(l);
            libraryCache = converted;
            return converted;
        });

    return lib;
}

export function cachedLibrary(): Library {
    return libraryCache;
}

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

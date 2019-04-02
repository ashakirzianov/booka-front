import {
    Book, Library, library, BookId, sameId, BookPath,
} from '../model';
import { fetchBI, fetchLibrary, convertBook, convertLibrary } from '../api';

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

type BookPositionStore = {
    [bi in string]?: BookPath;
};
const positionStore: BookPositionStore = {};

export async function currentPosition(bookId: BookId): Promise<BookPath> {
    const inStore = positionStore[bookId.name];
    return inStore || [];
}

export function setCurrentPosition(bookId: BookId, path: BookPath) {
    positionStore[bookId.name] = path;
}

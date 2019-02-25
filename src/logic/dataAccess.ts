import {
    Book, Library, library, BookId, sameId,
} from '../model';
import { fetchBI, fetchLibrary } from '../api';

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
        storeBook(bookStore, b);
        return b;
    });

    return bookPromise;
}

let libraryCache = library();
export async function currentLibrary(): Promise<Library> {
    const lib = fetchLibrary()
        .then(l => {
            libraryCache = l;
            return l;
        });

    return lib;
}

export function cachedLibrary(): Library {
    return libraryCache;
}

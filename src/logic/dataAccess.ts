import {
    Book, Library, library, BookId, sameId, errorBook,
} from '../model';
import { fetchBI, fetchLibrary } from '../api';
import { convertBook, convertLibrary } from '../api/converters';

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
        if (b.book === 'book') {
            const converted = convertBook(b, bi);
            storeBook(bookStore, converted);
            return converted;
        } else {
            return errorBook(b.error);
        }
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

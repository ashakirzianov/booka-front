import {
    loadingBook, Book, Library, library, BookId, sameId,
} from '../model';
import { dispatchAction, actionCreators } from '../redux';
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

export function bookForId(bi: BookId): Book {
    const book = bookFromStore(bookStore, bi);
    if (book) {
        return book;
    }

    const desc = fetchBI(bi).then(b => {
        storeBook(bookStore, b);
        return b;
    });
    dispatchAction(actionCreators.loadBook(desc));

    return loadingBook();
}

let cachedLibrary = library();
export function currentLibrary(): Library {
    const lib = fetchLibrary()
        .then(l => {
            cachedLibrary = l;
            return l;
        });

    dispatchAction(actionCreators.loadLibrary(lib));
    return cachedLibrary;
}

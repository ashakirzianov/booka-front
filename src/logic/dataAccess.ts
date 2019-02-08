import {
    BookLocator, loadingBook, Book, Library, LoadBookDesc, pointToSameBook, library,
} from '../model';
import { dispatchAction, actionCreators } from '../redux';
import { fetchBL, fetchLibrary } from '../api';

type BookStore = Array<LoadBookDesc>;
const bookStore: BookStore = [];
function bookFromStore(store: BookStore, bl: BookLocator): Book | undefined {
    const desc = store.find(d => pointToSameBook(d.locator, bl));

    return desc && desc.book;
}

function storeBook(store: BookStore, desc: LoadBookDesc) {
    const index = store.findIndex(d => pointToSameBook(d.locator, desc.locator));

    if (index >= 0) {
        store[index] = desc;
    } else {
        store.push(desc);
    }
}

export function bookForLocator(bl: BookLocator): Book {
    const book = bookFromStore(bookStore, bl);
    if (book) {
        return book;
    }

    const desc = fetchBL(bl).then(b => {
        const d = {
            locator: bl,
            book: b,
        }
        storeBook(bookStore, d);
        return d;
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

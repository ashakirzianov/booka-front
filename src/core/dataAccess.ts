import {
    Book, Library, BookId,
} from '../model';
import { fetchBI, fetchLibrary, convertBook, convertLibrary } from '../api';
import { bookFromStore, storeBook, cacheLibrary, cachedLibrary } from './persistent';

export async function bookForId(bi: BookId): Promise<Book> {
    const book = bookFromStore(bi);
    if (book) {
        return book;
    }

    const volume = await fetchBI(bi);
    const converted = convertBook(volume, bi);
    storeBook(converted);

    return converted;
}

export async function currentLibrary(): Promise<Library> {
    try {
        const lib = await fetchLibrary();

        const converted = convertLibrary(lib);
        cacheLibrary(converted);

        return converted;
    } catch {
        // TODO: report problems ?
        return cachedLibrary();
    }
}

import {
    Book, Library, BookId, library,
} from '../model';
import { fetchBI, fetchLibrary, convertBook, convertLibrary } from '../api';
import { stores } from './persistent';
import { forEach } from '../utils';

export async function bookForId(bi: BookId): Promise<Book> {
    const book = stores.books.get(bi.name);
    if (book) {
        return book;
    }

    const volume = await fetchBI(bi);
    const converted = convertBook(volume, bi);
    stores.books.set(converted.id.name, converted);

    return converted;
}

export async function currentLibrary(): Promise<Library> {
    try {
        const lib = await fetchLibrary();

        const converted = convertLibrary(lib);
        forEach(converted.books, (id, info) => stores.library.set(id, info));

        return converted;
    } catch {
        // TODO: report problems ?
        return library(stores.library.all());
    }
}

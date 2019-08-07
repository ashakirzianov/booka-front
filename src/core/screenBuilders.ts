import {
    bookScreen, libraryScreen, BookScreen, LibraryScreen,
    BookLocator, bookLocator, locationPath,
} from '../model';
import { bookForId, currentLibrary } from './dataAccess';
import { stores } from './persistent';

export async function buildBookScreen(bl: BookLocator): Promise<BookScreen> {
    if (bl.location.location === 'current') {
        const position = stores.positions.get(bl.id.name) || [];
        bl = bookLocator(bl.id, locationPath(position));
    }
    const book = await bookForId(bl.id);
    if (book) {
        return bookScreen(book, bl);
    } else {
        // TODO: handle more gracefully
        throw new Error(`Couldn't fetch book for id: '${bl.id.name}'`);
    }
}

export async function buildLibraryScreen(): Promise<LibraryScreen> {
    const lib = await currentLibrary();
    return libraryScreen(lib);
}

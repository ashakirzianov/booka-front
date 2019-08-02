import {
    bookScreen, libraryScreen, BookScreen, LibraryScreen,
    BookLocator, bookLocator, locationPath,
} from '../model';
import { bookForId, currentLibrary } from './dataAccess';
import { stores } from './persistent';

export async function buildBookScreen(bl: BookLocator): Promise<BookScreen> {
    const book = bookForId(bl.id);
    if (bl.location.location === 'current') {
        const position = stores.positions.get(bl.id.name) || [];
        bl = bookLocator(bl.id, locationPath(position));
    }

    return bookScreen(await book, bl);
}

export async function buildLibraryScreen(): Promise<LibraryScreen> {
    const lib = await currentLibrary();
    return libraryScreen(lib);
}

import {
    bookScreen, libraryScreen, BookScreen, LibraryScreen,
    BookLocator, bookLocator, locationPath,
} from '../model';
import { bookForId, currentLibrary } from './dataAccess';
import { resolveCurrentPosition } from './persistent';

export async function buildBookScreen(bl: BookLocator): Promise<BookScreen> {
    const book = bookForId(bl.id);
    if (bl.location.location === 'current') {
        const position = await resolveCurrentPosition(bl.id);
        bl = bookLocator(bl.id, locationPath(position));
    }

    const toc = bl.location.location === 'toc';
    const fid = bl.location.location === 'footnote'
        ? bl.location.id
        : undefined;

    return bookScreen(await book, bl, toc, fid);
}

export async function buildLibraryScreen(): Promise<LibraryScreen> {
    const lib = await currentLibrary();
    return libraryScreen(lib);
}

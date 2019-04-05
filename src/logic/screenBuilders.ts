import {
    bookScreen, libraryScreen, AppScreen,
    BookLocator, bookLocator, locationPath,
} from '../model';
import { bookForId, currentLibrary } from './dataAccess';
import { positionStore } from './persistent';

export async function buildBookScreen(bl: BookLocator): Promise<AppScreen> {
    const book = bookForId(bl.id);
    if (bl.location.location === 'current') {
        const store = await positionStore();
        const position = store[bl.id.name] || [];
        bl = bookLocator(bl.id, locationPath(position));
    }

    const toc = bl.location.location === 'toc';
    const fid = bl.location.location === 'footnote'
        ? bl.location.id
        : undefined;

    return bookScreen(await book, bl, toc, fid);
}

export async function buildLibraryScreen(): Promise<AppScreen> {
    const lib = await currentLibrary();
    return libraryScreen(lib);
}

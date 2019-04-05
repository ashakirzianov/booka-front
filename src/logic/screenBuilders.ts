import {
    bookScreen, libraryScreen, AppScreen,
    BookLocator,
    updatePath,
} from '../model';
import { bookForId, currentLibrary, positionStore } from './dataAccess';

export async function buildBookScreen(bl: BookLocator): Promise<AppScreen> {
    const book = bookForId(bl.id);
    if (bl.location.location === 'current') {
        const store = await positionStore();
        const position = store[bl.id.name] || [];
        bl = updatePath(bl, position);
    }

    // TODO: fix open toc, etc.
    return bookScreen(await book, bl, false, undefined);
}

export async function buildLibraryScreen(): Promise<AppScreen> {
    const lib = await currentLibrary();
    return libraryScreen(lib);
}

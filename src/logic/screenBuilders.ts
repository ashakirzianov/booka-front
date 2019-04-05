import {
    bookScreen, libraryScreen, AppScreen,
    BookLocator, resolveBL,
} from '../model';
import { bookForId, currentLibrary, positionStore } from './dataAccess';

export async function buildBookScreen(bl: BookLocator): Promise<AppScreen> {
    const store = await positionStore();
    const resolved = resolveBL(bl, store);
    const book = await bookForId(resolved.id);

    // TODO: fix open toc, etc.
    return bookScreen(book, resolved, false, undefined);
}

export async function buildLibraryScreen(): Promise<AppScreen> {
    const lib = await currentLibrary();
    return libraryScreen(lib);
}

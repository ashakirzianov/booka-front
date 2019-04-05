import {
    bookScreen, libraryScreen, AppScreen,
    BookLocator,
} from '../model';
import { bookForId, currentLibrary } from './dataAccess';

export async function buildBookScreen(bl: BookLocator): Promise<AppScreen> {
    // const store = await positionStore();
    const book = await bookForId(bl.id);

    // TODO: fix open toc, etc.
    return bookScreen(book, bl, false, undefined);
}

export async function buildLibraryScreen(): Promise<AppScreen> {
    const lib = await currentLibrary();
    return libraryScreen(lib);
}

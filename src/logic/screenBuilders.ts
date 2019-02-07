import {
    BookLocator, BookScreen, bookScreen, LibraryScreen, libraryScreen,
} from '../model';
import { bookForLocator, currentLibrary } from './dataAccess';

export function buildBookScreen(bl: BookLocator): BookScreen {
    const screen = bookScreen(bookForLocator(bl), bl);

    return screen;
}

export function buildLibraryScreen(): LibraryScreen {
    const screen = libraryScreen(currentLibrary());

    return screen;
}

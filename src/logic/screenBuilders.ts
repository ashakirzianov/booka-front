import {
    BookLocator, BookScreen, bookScreen, LibraryScreen, libraryScreen, ScreenStack, topScreen, Screen, TocScreen, tocScreen,
} from '../model';
import { bookForLocator, currentLibrary } from './dataAccess';
import { tocFromBook } from '../model/tableOfContent';

export function buildBookScreen(bl: BookLocator): BookScreen {
    const screen = bookScreen(bookForLocator(bl), bl);

    return screen;
}

export function buildLibraryScreen(): LibraryScreen {
    const screen = libraryScreen(currentLibrary());

    return screen;
}

export function buildTocScreen(bl: BookLocator): TocScreen {
    const book = bookForLocator(bl);
    const toc = tocFromBook(book);
    const screen = tocScreen(toc, bl);

    return screen;
}

export function buildTopScreen(stack: ScreenStack): Screen {
    const top = topScreen(stack);

    return top || buildLibraryScreen();
}

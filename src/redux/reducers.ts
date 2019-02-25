import {
    ActionsTemplate, App, Screen, pointToSameBook, libraryScreen, forScreen, updatePath, tocScreen, bookScreen,
} from '../model';
import { buildPartialReducers } from './redux-utils';
import { tocFromBook } from '../model/tableOfContent';

export const reducer = buildPartialReducers<App, ActionsTemplate>({
    screen: {
        navigateToScreen: (s, p) => p,
        loadBook: {
            fulfilled: (screen, book) => forScreen<Screen>(screen, {
                book: bs => pointToSameBook(bs.bl, book.locator)
                    ? bookScreen(book.book, bs.bl)
                    : bs,
                toc: ts => pointToSameBook(ts.bl, book.locator)
                    ? tocScreen(tocFromBook(book.book), ts.bl)
                    : ts,
            }) || screen,
        },
        loadLibrary: {
            fulfilled: (screen, p) => forScreen(screen, {
                library: l => libraryScreen(p),
            }) || screen,
        },
        updateCurrentBookPosition: (screen, bp) => forScreen(screen, {
            book: bs => ({
                ...bs,
                bl: updatePath(bs.bl, bp),
            }),
        }) || screen,
    },
    positionToNavigate: {
        navigateToScreen: (path, screen) => forScreen(screen, {
            book: bs => bs.bl.range.start,
        }) || null,
    },
    controlsVisible: {
        toggleControls: (current, _) => !current,
    },
});

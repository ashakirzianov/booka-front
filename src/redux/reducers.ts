import {
    ActionsTemplate, App, Screen, libraryScreen, forScreen, updateRangeStart, tocScreen, bookScreen, sameId,
} from '../model';
import { buildPartialReducers } from './redux-utils';
import { tocFromBook } from '../model/tableOfContent';

export const reducer = buildPartialReducers<App, ActionsTemplate>({
    screen: {
        navigateToScreen: (s, p) => p,
        loadBook: {
            fulfilled: (screen, book) => forScreen<Screen>(screen, {
                book: bs => sameId(bs.bl.id, book.id)
                    ? bookScreen(book, bs.bl)
                    : bs,
                toc: ts => sameId(ts.bl.id, book.id)
                    ? tocScreen(tocFromBook(book), ts.bl)
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
                bl: updateRangeStart(bs.bl, bp),
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

import {
    ActionsTemplate, App, Screen, pointToSameBook, libraryScreen, forScreen, updatePath,
} from "../model";
import { buildPartialReducers } from "./redux-utils";
import { tocFromBook } from '../model/tableOfContent';

export const reducer = buildPartialReducers<App, ActionsTemplate>({
    screen: {
        navigateToScreen: (s, p) => p,
        loadBook: {
            fulfilled: (screen, book) => forScreen<Screen>(screen, {
                book: bs => {
                    if (pointToSameBook(bs.bl, book.locator)) {
                        return {
                            ...bs,
                            book: book.book,
                        };
                    }
                    return bs;
                },
                toc: ts => {
                    if (pointToSameBook(ts.bl, book.locator)) {
                        return {
                            ...ts,
                            toc: tocFromBook(book.book),
                        };
                    }
                    return ts;
                },
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
            book: bs => bs.bl.path,
        }) || null,
    },
    controlsVisible: {
        toggleControls: (current, _) => !current,
    },
});

import {
    ActionsTemplate, App, Screen, pointToSameBook, libraryScreen, forScreen, updatePath,
} from "../model";
import { buildPartialReducers } from "./redux-utils";

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
                            loading: false,
                        };
                    }
                    return bs;
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
});

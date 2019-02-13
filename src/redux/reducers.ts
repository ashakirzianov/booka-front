import {
    ActionsTemplate, App, pushScreen, popScreen, pointToSameBook, stackForScreen, libraryScreen, forScreen,
} from "../model";
import { buildPartialReducers } from "./redux-utils";

export const reducer = buildPartialReducers<App, ActionsTemplate>({
    screenStack: {
        navigateToScreen: (s, p) => pushScreen(s, p),
        navigateBack: (s, _) => popScreen(s),
        loadBook: {
            fulfilled: (s, p) => stackForScreen(s, {
                book: bs => {
                    if (pointToSameBook(bs.bl, p.locator)) {
                        return {
                            ...bs,
                            book: p.book,
                        };
                    }
                    return bs;
                },
            }),
        },
        loadLibrary: {
            fulfilled: (s, p) => stackForScreen(s, {
                library: l => libraryScreen(p),
            }),
        },
    },
    currentBookPosition: {
        updateCurrentBookPosition: (cur, path) => path,
    },
    positionToNavigate: {
        navigateToScreen: (path, screen) => forScreen(screen, {
            book: bs => bs.bl.path,
        }) || null,
    },
});

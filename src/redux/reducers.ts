import {
    ActionsTemplate, App, pushScreen, popScreen, ifBookScreen, pointToSameBook, forScreen, libraryScreen,
} from "../model";
import { buildPartialReducers } from "./redux-utils";

export const reducer = buildPartialReducers<App, ActionsTemplate>({
    screenStack: {
        navigateToScreen: (s, p) => pushScreen(s, p),
        navigateBack: (s, _) => popScreen(s),
        loadBook: {
            fulfilled: (s, p) => ifBookScreen(s, bs => {
                if (pointToSameBook(bs.bl, p.locator)) {
                    return {
                        ...bs,
                        book: p.book,
                    };
                }
                return bs;
            }),
        },
        loadLibrary: {
            fulfilled: (s, p) => forScreen(s, {
                library: l => libraryScreen(p),
            }),
        }
    },
});

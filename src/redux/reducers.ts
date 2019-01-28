import { ActionsTemplate, App, loading, errorBook, bookScreen, libraryScreen, pushScreen } from "../model";
import { buildPartialReducers } from "./redux-utils";

export const reducer = buildPartialReducers<App, ActionsTemplate>({
    screenStack: {
        setCurrentBook: {
            pending: (s, _) => pushScreen(s, bookScreen()),
        },
        loadLibrary: {
            pending: (s, _) => pushScreen(s, libraryScreen()),
        },
    },
    library: {
        loadLibrary: {
            pending: s => loading(),
            fulfilled: (_, p) => p,
            rejected: (s, p) => ({}), // TODO: report load error
        },
    },
    currentBook: {
        setCurrentBook: {
            pending: s => loading(),
            fulfilled: (_, p) => p,
            rejected: (s, p) => errorBook(p && p.toString && p.toString()),
        }
    },
});

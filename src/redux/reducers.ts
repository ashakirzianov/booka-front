import { ActionsTemplate, App, loading, errorBook, bookScreen, libraryScreen, pushScreen } from "../model";
import { buildPartialReducers } from "./redux-utils";

export const reducer = buildPartialReducers<App, ActionsTemplate>({
    screenStack: {
        setBook: {
            pending: (s, _) => pushScreen(s, bookScreen()),
        },
        loadLib: {
            pending: (s, _) => pushScreen(s, libraryScreen()),
        },
    },
    library: {
        loadLib: {
            pending: s => loading(),
            fulfilled: (_, p) => p,
            rejected: (s, p) => ({}), // TODO: report load error
        },
    },
    currentBook: {
        setBook: {
            pending: s => loading(),
            fulfilled: (_, p) => p,
            rejected: (s, p) => errorBook(p && p.toString && p.toString()),
        }
    },
});

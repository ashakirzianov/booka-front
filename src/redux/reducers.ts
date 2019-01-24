import { ActionsTemplate, App, loading, errorBook, bookScreen, libraryScreen } from "../model";
import { buildPartialReducers } from "./redux-utils";

export const reducer = buildPartialReducers<App, ActionsTemplate>({
    screen: {
        setBook:  {
            pending: s => bookScreen(loading()),
            fulfilled: (_, p) => bookScreen(p),
            rejected: (s, p) => bookScreen(errorBook(p && p.toString && p.toString())),
        },
        loadLib: {
            pending: s => libraryScreen(loading()),
            fulfilled: (_, p) => libraryScreen(p),
            rejected: (s, p) => libraryScreen({}),
        },
    },
});

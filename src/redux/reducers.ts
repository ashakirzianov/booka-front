import { ActionsTemplate, App, loading, errorBook, bookScreen, libraryScreen, pushScreen, library } from "../model";
import { buildPartialReducers } from "./redux-utils";

export const reducer = buildPartialReducers<App, ActionsTemplate>({
    screenStack: {
        navigateToBookScreen:
            (s, _) => pushScreen(s, bookScreen()),
        navigateToLibraryScreen:
            (s, _) => pushScreen(s, libraryScreen()),
    },
    library: {
        loadLibrary: {
            pending: s => loading(),
            fulfilled: (_, p) => p,
            rejected: (s, p) => library(), // TODO: report load error
        },
    },
    currentBook: {
        setCurrentBook: {
            pending:
                _ => loading(),
            fulfilled:
                (_, p) => p,
            rejected:
                (_, p) => errorBook(p && p.toString && p.toString()),
        }
    },
});

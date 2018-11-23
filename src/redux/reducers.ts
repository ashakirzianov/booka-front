import { ActionsTemplate, App, loading, errorBook } from "../model";
import { buildPartialReducers } from "./redux-utils";

export const reducer = buildPartialReducers<App, ActionsTemplate>({
    book: {
        setBook: {
            pending: s => loading(),
            fulfilled: (_, p) => p,
            rejected: (s, p) => errorBook(p && p.toString && p.toString()),
        },
    },
    library: {
        loadLib: {
            pending: s => loading(),
            fulfilled: (_, p) => p,
            rejected: (s, p) => ({}),
        }
    },
});

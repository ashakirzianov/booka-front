import { ActionsTemplate, App, pushScreen } from "../model";
import { buildPartialReducers } from "./redux-utils";

export const reducer = buildPartialReducers<App, ActionsTemplate>({
    screenStack: {
        navigateToScreen: {
            pending: (s, p) => pushScreen(s, p),
            fulfilled: (s, p) => pushScreen(s, p),
        },
    },
});

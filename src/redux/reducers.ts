import {
    ActionsTemplate, App, pushScreen, popScreen, replaceScreen,
} from "../model";
import { buildPartialReducers } from "./redux-utils";

export const reducer = buildPartialReducers<App, ActionsTemplate>({
    screenStack: {
        navigateToScreen: {
            pending: (s, p) => pushScreen(s, p),
            fulfilled: (s, p) => replaceScreen(s, p),
        },
        navigateBack: (s, _) => popScreen(s),
    },
});

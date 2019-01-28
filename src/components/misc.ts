import { createBrowserHistory } from "history";
import { fetchBL, fetchLibrary } from "../api";
import { store, buildActionCreators, buildConnectRedux } from '../redux';
import { staticBookLocator, actionsTemplate, App } from "../model";

export const history = createBrowserHistory();

export function dispatchNavidationEvent(dest: Destination) {
    const action = navigationToAction(dest);
    if (action) {
        store.dispatch(action);
    }
}
const actionCreators = buildActionCreators(actionsTemplate);

export type Destination = string;
export function navigationToAction(dest: Destination) {
    const bookRouteMatch = dest.match(/^\/book\/(\w+)/);
    if (bookRouteMatch) {
        const bookName = bookRouteMatch[1];
        const bl = staticBookLocator(bookName);
        return actionCreators.setCurrentBook(fetchBL(bl));
    }

    if (dest === '/') {
        return actionCreators.loadLibrary(fetchLibrary());
    }

    return undefined;
}


export const connect = buildConnectRedux<App, typeof actionsTemplate>(actionsTemplate);

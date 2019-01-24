import { createBrowserHistory, Location, Action } from "history";
import { fetchBL, fetchLibrary } from "../api";
import { store, buildActionCreators, buildConnectRedux } from '../redux';
import { staticBookLocator, BookLocator, actionsTemplate, App } from "../model";

export const history = createBrowserHistory();

export function dispatchHistoryEvent(location: Location, action?: Action) {
    // TODO: this is bad. do better
    dispatchNavigationTo(location.pathname);
}

export type Destination = string;
export function dispatchNavigationTo(dest: Destination) {
    const bookRouteMatch = dest.match(/^\/book\/(\w+)/);
    if (bookRouteMatch) {
        const bookName = bookRouteMatch[1];
        dispatchLoadBLAction(staticBookLocator(bookName));
    }

    if (dest === '/') {
        dispatchLoadLibraryAction();
    }
}

const actionCreators = buildActionCreators(actionsTemplate);
export function dispatchLoadBLAction(bl: BookLocator) {
    store.dispatch(actionCreators.setBook(fetchBL(bl)));
}

export function dispatchLoadLibraryAction() {
    store.dispatch(actionCreators.loadLib(fetchLibrary()));
}

export const connect = buildConnectRedux<App, typeof actionsTemplate>(actionsTemplate);

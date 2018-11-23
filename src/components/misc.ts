import { createBrowserHistory, Location, Action } from "history";
import { fetchBL, fetchLibrary } from "../api";
import { store, buildActionCreators, buildConnectRedux } from '../redux';
import { staticBookLocator, BookLocator, actionsTemplate, App } from "../model";

export const history = createBrowserHistory();

export function dispatchHistoryEvent(location: Location, action?: Action) {
    // TODO: this is bad. do better
    const bookRouteMatch = location.pathname.match(/^\/book\/(\w+)/);
    if (bookRouteMatch) {
        const bookName = bookRouteMatch[1];
        dispatchLoadBLAction(staticBookLocator(bookName));
    }

    if (location.pathname === '/') {
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

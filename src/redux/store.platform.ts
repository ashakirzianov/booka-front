import { createBrowserHistory } from 'history';
import { dispatchNavigationEvent } from './urlNavigation';
import { Middleware } from 'redux';
import { App, topScreen } from '../model';
import { assertNever } from '../utils';

const history = createBrowserHistory();
export function storeDidCreate() {
    dispatchNavigationEvent(history.location.pathname);
    history.listen((location, action) => {
        if (action === 'REPLACE') {
            dispatchNavigationEvent(location.pathname);
        }
    });
}

export const updateHistoryMiddleware: Middleware<{}, App> = store => next => action => {
    const result = next(action);
    const url = stateToUrl(store.getState());
    if (history.location.pathname !== url) {
        history.push(url);
    }
    return result;
};

function stateToUrl(state: App) {
    const top = topScreen(state.screenStack);
    switch (top.screen) {
        case 'library':
            return '/';
        case 'book':
            return `/book/${top.bl.name}`;
        case 'blank':
            return '/';
        default:
            return assertNever(top);
    }
}

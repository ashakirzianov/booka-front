import { createBrowserHistory } from 'history';
import { Middleware } from 'redux';
import { dispatchNavigationEvent } from './urlNavigation';
import { App, topScreen, blToString } from '../model';
import { assertNever } from '../utils';

const history = createBrowserHistory();
export function onInit() {
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
    if (top === undefined) {
        return '/';
    }

    switch (top.screen) {
        case 'library':
            return '/';
        case 'book':
            return `/book/${blToString(top.bl)}`;
        case 'blank':
            return '/';
        default:
            return assertNever(top);
    }
}

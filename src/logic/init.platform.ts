import { createBrowserHistory } from 'history';
import { Middleware } from 'redux';
import { dispatchNavigationEvent } from './urlNavigation';
import { App, topScreen, BookPath } from '../model';
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
        // history.push(url);
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
            const path = pathToString(top.bl.path);
            return `/book/${top.bl.name}${path}`;
        case 'blank':
            return '/';
        default:
            return assertNever(top);
    }
}

function pathToString(path: BookPath): string {
    return path.length === 0 || (path.length === 1 && path[0] === 0)
        ? ''
        : `/${path.join('-')}`
        ;
}

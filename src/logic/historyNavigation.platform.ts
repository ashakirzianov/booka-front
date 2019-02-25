import { createBrowserHistory } from 'history';
import { dispatchNavigationEvent } from './routing';
import { App, blToString, BookLocator } from '../model';
import { assertNever } from '../utils';
import { Middleware } from 'redux';

const history = createBrowserHistory();
export function wireHistoryNavigation() {
    dispatchNavigationEvent(history.location.pathname);
    history.listen((location, action) => {
        if (action !== 'REPLACE') {
            dispatchNavigationEvent(location.pathname);
        }
    });
}

function navigateToUrl(url: string) {
    history.push(url);
}

export function navigateToBl(bl: BookLocator) {
    navigateToUrl('/book/' + blToString(bl));
}

export function navigateBack() {
    history.goBack();
}

export function navigateToLibrary() {
    navigateToUrl('/');
}

export const updateHistoryMiddleware: Middleware<{}, App> = store => next => action => {
    const result = next(action);
    const currState = store.getState();
    const url = stateToUrl(currState);
    if (history.location.pathname !== url) {
        history.replace(url);
    }
    return result;
};

export function stateToUrl(state: App) {
    const current = state.screen;

    switch (current.screen) {
        case 'library':
            return '/';
        case 'book':
            return `/book/${blToString(current.bl)}`;
        case 'toc':
            return `/toc/${blToString(current.bl)}`;
        default:
            return assertNever(current);
    }
}

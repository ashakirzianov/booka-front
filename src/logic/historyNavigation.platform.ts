import { createBrowserHistory } from 'history';
import { dispatchNavigationEvent } from './routing';
import { App, blToString, BookLocator, biToString, BookId } from '../model';
import { assertNever } from '../utils';
import { Middleware } from 'redux';

const history = createBrowserHistory();

function fullUrl(location: typeof history['location']) {
    const { pathname, search, hash } = location;
    return pathname + search + hash;
}

export function wireHistoryNavigation() {
    dispatchNavigationEvent(fullUrl(history.location));
    history.listen((l, e) => {
        if (e === 'POP') {
            dispatchNavigationEvent(fullUrl(l));
        }
    });
}

export function navigateToUrl(url: string) {
    history.push(url);
    dispatchNavigationEvent(url);
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

export function navigateToToc(bi: BookId) {
    navigateToUrl('/toc/' + biToString(bi));
}

export const updateHistoryMiddleware: Middleware<{}, App> = store => next => action => {
    const result = next(action);
    const currState = store.getState();
    const urlFromState = stateToUrl(currState);
    const fullCurrentUrl = fullUrl(history.location);
    if (fullCurrentUrl !== urlFromState) {
        history.replace(urlFromState);
    }
    return result;
};

export function stateToUrl(state: App) {
    const current = state.screen;

    switch (current.screen) {
        case 'library':
            return '/';
        case 'book':
            let search = '';
            search += current.tocOpen ? 'toc' : '';
            search += current.footnoteId ? `fid=${current.footnoteId}` : '';

            search = search ? '?' + search : '';
            return `/book/${blToString(current.bl)}${search}`;
        default:
            return assertNever(current);
    }
}

import { createBrowserHistory } from 'history';
import { dispatchNavigationEvent } from './routing';
import { App, blToString, BookLocator, biToString, BookId } from '../model';
import { assertNever } from '../utils';
import { Middleware } from 'redux';

const history = createBrowserHistory();
export function wireHistoryNavigation() {
    dispatchNavigationEvent(history.location.pathname);
    history.listen((l, e) => {
        if (e === 'POP') {
            dispatchNavigationEvent(l.pathname);
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
            const prefix = current.tocOpen ? 'toc' : 'book';
            return `/${prefix}/${blToString(current.bl)}`;
        default:
            return assertNever(current);
    }
}

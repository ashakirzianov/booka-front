import { createBrowserHistory } from 'history';
import { Middleware } from 'redux';
import { dispatchNavigationEvent } from './urlNavigation';
import { App, topScreen, blToString, pointToSameBook } from '../model';
import { assertNever } from '../utils';

const history = createBrowserHistory();
export function onInit() {
    dispatchNavigationEvent(history.location.pathname);
    history.listen((location, action) => {
        if (action !== 'REPLACE') {
            dispatchNavigationEvent(location.pathname);
        }
    });
}

export const updateHistoryMiddleware: Middleware<{}, App> = store => next => action => {
    const prevState = store.getState();
    const result = next(action);
    const currState = store.getState();
    const url = stateToUrl(currState);
    if (history.location.pathname !== url) {
        if (needToReplace(prevState, currState)) {
            history.replace(url);
        } else {
            history.push(url);
        }
    }
    return result;
};

function needToReplace(prevState: App, currState: App): boolean {
    const prevTop = topScreen(prevState.screenStack);
    const currTop = topScreen(currState.screenStack);

    if (prevTop && currTop && prevTop.screen === 'book' && currTop.screen === 'book') {
        return pointToSameBook(prevTop.bl, currTop.bl);
    } else {
        return false;
    }
}

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

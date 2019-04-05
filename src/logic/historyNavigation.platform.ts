import { createBrowserHistory } from 'history';
import { App } from '../model';
import { Middleware } from 'redux';
import { stateToUrl } from './urlConversion';
import { dispatchUrlNavigation } from '../redux/store';

const history = createBrowserHistory();

function fullUrl(location: typeof history['location']) {
    const { pathname, search, hash } = location;
    return pathname + search + hash;
}

export function wireHistoryNavigation() {
    dispatchUrlNavigation(fullUrl(history.location));
    history.listen((l, e) => {
        if (e === 'POP') {
            dispatchUrlNavigation(fullUrl(l));
        }
    });
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

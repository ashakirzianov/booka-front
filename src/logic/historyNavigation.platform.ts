import { createBrowserHistory } from 'history';
import { stateToUrl } from './urlConversion';
import { dispatchUrlNavigation, subscribe } from '../redux/store';

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

subscribe(state => {
    const urlFromState = stateToUrl(state);
    const fullCurrentUrl = fullUrl(history.location);
    if (fullCurrentUrl !== urlFromState) {
        history.replace(urlFromState);
    }
});

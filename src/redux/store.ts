import * as React from 'react';
import { Provider } from 'react-redux';
import { reducer } from './reducers';
import { createEnhancedStore } from './redux-utils';
import { updateHistoryMiddleware, syncMiddleware } from '../logic';
import { Action } from './actions';
import { urlToAction } from '../logic/urlConversion';
import { App } from '../model';

export function dispatchUrlNavigation(url: string) {
    const action = urlToAction(url);
    if (action) {
        // TODO: report errors ?
        store.dispatch(action);
    }
}

export function subscribe(f: (state: App) => void) {
    // TODO: better solution ? we need it to make sure that store exists
    if (!store) {
        setTimeout(() => subscribe(f));
    } else {
        store.subscribe(() => f(store.getState()));
    }
}

class AppProvider extends Provider<Action> { }
export const ConnectedProvider: React.SFC = props =>
    React.createElement(AppProvider, { store: store }, props.children);

const store = createEnhancedStore(reducer, [
    updateHistoryMiddleware,
    syncMiddleware,
]);

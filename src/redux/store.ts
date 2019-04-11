import * as React from 'react';
import { Provider } from 'react-redux';
import { debug, clearAllStores } from '../utils';
import { App } from '../model';
import { urlToAction } from '../logic';
import { reducer } from './reducers';
import { createEnhancedStore } from './redux-utils';
import { Action } from './actions';

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

debug(() => false ? clearAllStores() : null);
const store = createEnhancedStore(reducer);

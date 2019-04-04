import * as React from 'react';
import { Provider } from 'react-redux';
import { reducer } from './reducers';
import { createEnhancedStore } from './redux-utils';
import { updateHistoryMiddleware, syncMiddleware } from '../logic';
import { Action } from './actions';

export function dispatchAction(action: Action) {
    store.dispatch(action);
}
class AppProvider extends Provider<Action> { }
export const ConnectedProvider: React.SFC = props =>
    React.createElement(AppProvider, { store: store }, props.children);

const store = createEnhancedStore(reducer, [
    updateHistoryMiddleware,
    syncMiddleware,
]);

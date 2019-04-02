import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { throttle } from 'lodash';
import { reducer } from './reducers';
import promiseMiddleware from 'redux-promise-middleware';
import { buildActionCreators, ActionsType } from './redux-utils';
import { actionsTemplate } from '../model';
import { storeState, initialState, updateHistoryMiddleware, syncMiddleware } from '../logic';

export const actionCreators = buildActionCreators(actionsTemplate);
export type Action = ActionsType<typeof actionsTemplate>;
export function dispatchAction(action: Action) {
    store.dispatch(action);
}
export const ConnectedProvider: React.SFC = props =>
    React.createElement(Provider, { store: store }, props.children);

const initial = initialState();
const store = createStore(reducer, initial, applyMiddleware(
    promiseMiddleware(),
    updateHistoryMiddleware,
    syncMiddleware,
));

store.subscribe(throttle(() => {
    storeState(store.getState());
}, 1000));

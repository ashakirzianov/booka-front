import * as React from 'react';
import { Provider } from 'react-redux';
import { throttle } from 'lodash';
import { reducer } from './reducers';
import { buildActionCreators, ActionsType, createEnhancedStore } from './redux-utils';
import { storeState, initialState, updateHistoryMiddleware, syncMiddleware } from '../logic';
import { actionsTemplate } from './actions';

export const actionCreators = buildActionCreators(actionsTemplate);
export type Action = ActionsType<typeof actionsTemplate>;
export function dispatchAction(action: Action) {
    store.dispatch(action);
}
class AppProvider extends Provider<Action> { }
export const ConnectedProvider: React.SFC = props =>
    React.createElement(AppProvider, { store: store }, props.children);

const initial = initialState();

const store = createEnhancedStore(reducer, initial, [
    updateHistoryMiddleware,
    syncMiddleware,
]);

store.subscribe(throttle(() => {
    storeState(store.getState());
}, 1000));

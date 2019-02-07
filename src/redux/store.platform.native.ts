import { dispatchNavigationEvent } from '../logic/urlNavigation';
import { Middleware } from 'redux';

export function storeDidCreate() {
    dispatchNavigationEvent('/');
}

export const updateHistoryMiddleware: Middleware = store => next => action => {
    return next(action);
};

import { dispatchNavigationEvent } from './urlNavigation';
import { Middleware } from 'redux';

export function onInit() {
    dispatchNavigationEvent('/');
}

export const updateHistoryMiddleware: Middleware = store => next => action => {
    return next(action);
};

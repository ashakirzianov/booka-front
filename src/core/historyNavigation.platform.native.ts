import { Middleware } from 'redux';
import { dispatchUrlNavigation } from '../redux';

export function wireHistoryNavigation() {
    dispatchUrlNavigation('/');
}

export const updateHistoryMiddleware: Middleware = store => next => action => {
    return next(action);
};

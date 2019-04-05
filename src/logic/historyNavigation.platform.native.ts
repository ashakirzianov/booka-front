import { Middleware } from 'redux';
import { dispatchUrlNavigation } from '../redux/store';

export function onInit() {
    dispatchUrlNavigation('/');
}

export const updateHistoryMiddleware: Middleware = store => next => action => {
    return next(action);
};

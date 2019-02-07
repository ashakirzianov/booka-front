import { remoteBookLocator } from '../model';
import { facade } from './facade';
import { Action, actionCreators, dispatchAction } from './store';

export type Destination = string;
export function destinationToActions(dest: Destination): Action[] {
    const bookRouteMatch = dest.match(/^\/book\/(\w+)/);
    if (bookRouteMatch) {
        const bookName = bookRouteMatch[1];
        const bl = remoteBookLocator(bookName);
        return [
            actionCreators.navigateToScreen(facade.bookScreen(bl)),
        ];
    }

    if (dest === '/') {
        return [
            actionCreators.navigateToScreen(facade.libraryScreen()),
        ];
    }

    return [];
}

export function dispatchNavigationEvent(dest: Destination) {
    const actions = destinationToActions(dest);
    actions.forEach(a => dispatchAction(a));
}

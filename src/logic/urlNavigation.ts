import { remoteBookLocator } from '../model';
import { actionCreators, dispatchAction } from '../redux';
import { buildBookScreen, buildLibraryScreen } from './screenBuilders';

export type Destination = string;
export function destinationToActions(dest: Destination) {
    const bookRouteMatch = dest.match(/^\/book\/(\w+)/);
    if (bookRouteMatch) {
        const bookName = bookRouteMatch[1];
        const bl = remoteBookLocator(bookName);
        return [
            actionCreators.navigateToScreen(buildBookScreen(bl)),
        ];
    }

    if (dest === '/') {
        return [
            actionCreators.navigateToScreen(buildLibraryScreen()),
        ];
    }

    return [];
}

export function dispatchNavigationEvent(dest: Destination) {
    const actions = destinationToActions(dest);
    actions.forEach(a => dispatchAction(a));
}

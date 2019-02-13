import { remoteBookLocator, BookLocator } from '../model';
import { actionCreators, dispatchAction } from '../redux';
import { buildBookScreen, buildLibraryScreen } from './screenBuilders';

export type Destination = string;
export function destinationToActions(dest: Destination) {
    const bookRouteMatch = dest.match(/^\/book\/([\w-\/]+)/);
    if (bookRouteMatch) {
        const bookLocatorString = bookRouteMatch[1];
        const bl = parseBL(bookLocatorString);
        if (bl) {
            if (bl.path.length > 0) {
                return [
                    actionCreators.navigateToScreen(buildBookScreen(bl)),
                    actionCreators.updateCurrentBookPosition(bl.path),
                ];
            } else {
                return [
                    actionCreators.navigateToScreen(buildBookScreen(bl)),
                ];
            }
        } else {
            return [];
        }
    }

    if (dest === '/') {
        return [
            actionCreators.navigateToScreen(buildLibraryScreen()),
        ];
    }

    return [];
}

function parseBL(url: string): BookLocator | undefined {
    const matches = url.match(/([\w-]+)(\/((\d+-?)+))?/);
    if (!matches) {
        return undefined;
    }
    const bookName = matches[1];
    const pathString = matches[3];
    if (pathString) {
        const path = pathString
            .split('-')
            .map(pc => parseInt(pc))
            ;
        return remoteBookLocator(bookName, path);
    }

    return remoteBookLocator(bookName);
}

export function dispatchNavigationEvent(dest: Destination) {
    const actions = destinationToActions(dest);
    actions.forEach(a => dispatchAction(a));
}

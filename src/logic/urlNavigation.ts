import { stringToBL } from '../model';
import { actionCreators, dispatchAction } from '../redux';
import { buildBookScreen, buildLibraryScreen } from './screenBuilders';
import { Action } from '../redux/store';
import { bite } from '../utils';

export type Destination = string;
export function destinationToActions(dest: Destination): Action[] {
    const actions = doRouting(dest, {
        [rootHandler]: () => [
            actionCreators.navigateToScreen(buildLibraryScreen()),
        ],
        book: blString => {
            const bl = stringToBL(blString);
            if (bl) {
                return [
                    actionCreators.navigateToScreen(buildBookScreen(bl)),
                    actionCreators.updateCurrentBookPosition(bl.path),
                ];
            } else {
                // TODO: handle incorrect bl
                return [];
            }
        }
    })
    
    return actions;
}

const rootHandler = 'root';
type RouteHandler = (route: string) => Action[];
type Router = {
    [rootHandler]: RouteHandler,
    [key: string]: RouteHandler;
}

function doRouting(dest: Destination, handlers: Router) {
    for (let key in handlers) {
        if (key !== rootHandler) {
            let rest = bite(dest, '/' + key);
            if (rest) {
                rest = bite(rest, '/') || rest;
                const handler = handlers[key];
                return handler(rest);
            }
        }
    }
    
    return handlers[rootHandler](dest);
}

export function dispatchNavigationEvent(dest: Destination) {
    const actions = destinationToActions(dest);
    actions.forEach(a => dispatchAction(a));
}

export function dispatchNavigateBackEvent() {
    dispatchAction(actionCreators.navigateBack());
}

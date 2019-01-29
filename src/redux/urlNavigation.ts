import { buildActionCreators, ActionsType } from './redux-utils';
import { actionsTemplate, staticBookLocator } from '../model';
import api from '../api';
import { store } from './store';

const actionCreators = buildActionCreators(actionsTemplate);

export type Destination = string;
export function destinationToActions(dest: Destination): ActionsType<typeof actionsTemplate>[] {
    const bookRouteMatch = dest.match(/^\/book\/(\w+)/);
    if (bookRouteMatch) {
        const bookName = bookRouteMatch[1];
        const bl = staticBookLocator(bookName);
        return [
            actionCreators.setCurrentBook(api.bookForLocator(bl)),
            actionCreators.navigateToBookScreen(),
        ];
    }

    if (dest === '/') {
        return [
            actionCreators.loadLibrary(api.library()),
            actionCreators.navigateToLibraryScreen(),
        ];
    }

    return [];
}

export function dispatchNavigationEvent(dest: Destination) {
    const actions = destinationToActions(dest);
    actions.forEach(a => store.dispatch(a));
}

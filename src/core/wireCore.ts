import { emptyPath } from 'booka-common';
import { wireHistoryNavigation } from './historyNavigation';
import { subscribe } from './store';
import { stores } from './persistent';
import { loginWithStoredToken } from './dataAccess';

export function wireCore() {
    wireHistoryNavigation();

    loginWithStoredToken();

    subscribe(state => {
        stores.theme.set(state.theme);
    });

    subscribe(state => {
        const { screen } = state;
        if (screen.screen === 'book' && screen.bl.location.location === 'path') {
            const id = screen.book.id;
            const position = screen.bl.location.path || emptyPath();
            stores.positions.set(id.name, position);
        }
    });
}

import { wireHistoryNavigation } from './historyNavigation';
import { subscribe } from './store';
import { stores } from './persistent';
import { emptyPath } from '../model';

export function wireCore() {
    wireHistoryNavigation();

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

import { Action, actionCreators } from '../redux/actions';
import {
    App, NavigationObject, pathToString, ToBook,
    BookLocation, remoteBookId, noForBookScreen, blToString,
} from '../model';
import { filterUndefined, assertNever } from '../utils';
import { parsePartialUrl } from '../parseUrl';

export function actionToUrl(action: Action | undefined, state: App) {
    const no = action && actionToNO(action, state);

    return no && noToUrl(no);
}

export function urlToAction(url: string): Action {
    const no = urlToNO(url);
    const action = noToAction(no);

    return action;
}

export function actionToNO(action: Action, state: App): NavigationObject | undefined {
    const { screen } = state;
    switch (action.type) {
        case 'navigate':
            return action.payload;
        case 'openFootnote':
            if (screen.screen === 'book' && action.payload) {
                return {
                    ...noForBookScreen(screen),
                    footnoteId: action.payload,
                };
            } else {
                return undefined;
            }
        case 'toggleToc':
            if (screen.screen === 'book') {
                return {
                    ...noForBookScreen(screen),
                    toc: !screen.tocOpen,
                };
            } else {
                return undefined;
            }
        default:
            return undefined;
    }
}

export function noToAction(no: NavigationObject): Action {
    return actionCreators.navigate(no);
}

export function noToUrl(no: NavigationObject): string {
    switch (no.navigate) {
        case 'book':
            const fs = filterString(no);
            switch (no.location.location) {
                case 'static':
                    return `/book/${no.id.name}/${pathToString(no.location.path)}${fs}`;
                case 'current':
                    return `/book/${no.id.name}/current${filterString}`;
            }
        // TODO: handle properly
        case 'library':
        case 'default':
        case 'unknown':
            return '/';
    }
}

export function urlToNO(url: string): NavigationObject {
    const parsedUrl = parsePartialUrl(url);
    const name = parsedUrl.path[1];
    if (!name) {
        return { navigate: 'unknown' };
    }

    const path = parsedUrl.path[2];
    const location = locationForPath(path);

    return {
        navigate: 'book',
        id: remoteBookId(name),
        location: location,
        toc: parsedUrl.search.toc !== undefined,
        footnoteId: parsedUrl.search.fid,
    };
}

export function stateToUrl(state: App) {
    const { screen } = state;

    switch (screen.screen) {
        case 'library':
            return '/';
        case 'book':
            let search = '';
            search += screen.tocOpen ? 'toc' : '';
            search += screen.footnoteId ? `fid=${screen.footnoteId}` : '';

            search = search ? '?' + search : '';
            return `/book/${blToString(screen.bl)}${search}`;
        default:
            return assertNever(screen);
    }
}

function locationForPath(pathString: string | undefined): BookLocation {
    switch (pathString) {
        case 'current':
            return { location: 'current' };
        case undefined:
            return { location: 'static' };
        default:
            const path = pathString
                .split('-')
                .map(pc => parseInt(pc, 10))
                ;
            return path.some(p => isNaN(p))
                ? { location: 'static' } // TODO: report errors in url ?
                : {
                    location: 'static',
                    path: path,
                };
    }
}

function filterString(toBook: ToBook) {
    const toc = toBook.toc ? 'toc' : undefined;
    const fid = toBook.footnoteId ? `fid=${toBook.footnoteId}` : undefined;
    const filters = filterUndefined([toc, fid]);

    const result = filters.length > 0
        ? '?' + filters.join('&')
        : '';
    return result;
}

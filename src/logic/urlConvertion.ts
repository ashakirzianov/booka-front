import { Action, actionCreators } from '../redux/actions';
import { App, NavigationObject, pathToString, ToBook, BookLocation, remoteBookId, BookScreen } from '../model';
import { filterUndefined } from '../utils';
import { parseUrl } from '../parseUrl';

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
    const parsedUrl = parseUrl(url);
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

function noForBookScreen(bs: BookScreen): ToBook {
    return {
        navigate: 'book',
        id: bs.bl.id,
        location: {
            location: 'static',
            path: bs.bl.range.start,
        },
        footnoteId: undefined,
        toc: false,
    };
}

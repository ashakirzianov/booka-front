import { Action, actionCreators } from '../redux/actions';
import {
    App, remoteBookId, bookLocator, locationCurrent,
    locationPath, BookLocation, stringToPath, BookLocator, pathToString,
} from '../model';
import { assertNever } from '../utils';
import { parsePartialUrl, ParsedUrl } from '../parseUrl';

export function actionToUrl(action: Action | undefined, state: App): string | undefined {
    if (!action) {
        return undefined;
    }

    const { screen } = state;
    switch (action.type) {
        case 'navigateToBook':
            return blToString(action.payload);
        case 'openFootnote':
            if (screen.screen === 'book' && action.payload) {
                // TODO: implement footnote location
                return blToString(screen.bl);
            } else {
                return undefined;
            }
        case 'toggleToc':
            if (screen.screen === 'book') {
                // TODO: implement toc location
                return blToString(screen.bl);
            } else {
                return undefined;
            }
        default:
            return undefined;
    }
}

export function urlToAction(url: string): Action | undefined {
    const parsedUrl = parsePartialUrl(url);
    const head = parsedUrl.path[0];
    switch (head) {
        case 'book':
            return parsedUrlToOpenBookAction(parsedUrl);
        case 'library':
        case '':
        default:
            // TODO: report errors ?
            return actionCreators.navigateToLibrary();
    }
}

function parsedUrlToOpenBookAction(parsedUrl: ParsedUrl): Action | undefined {
    const name = parsedUrl.path[1];
    if (!name) {
        return undefined; // TODO: report error ?
    }

    const path = parsedUrl.path[2];
    const location = locationForPath(path);
    const bl = bookLocator(remoteBookId(name), location);

    // TODO: implement toc, fid
    return actionCreators.navigateToBook(bl);
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
            return locationCurrent();
        default:
            return locationPath(stringToPath(pathString) || []);
    }
}

function blToString(bl: BookLocator): string {
    return `${bl.id.name}/${locationToString(bl.location)}`;
}

function locationToString(l: BookLocation) {
    switch (l.location) {
        case 'path':
            return pathToString(l.path);
        case 'current':
            return 'current';
        default:
            return assertNever(l);
    }
}

// function filterString(toBook: ToBook) {
//     const toc = toBook.toc ? 'toc' : undefined;
//     const fid = toBook.footnoteId ? `fid=${toBook.footnoteId}` : undefined;
//     const filters = filterUndefined([toc, fid]);

//     const result = filters.length > 0
//         ? '?' + filters.join('&')
//         : '';
//     return result;
// }

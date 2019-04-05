import { Action, actionCreators } from '../redux/actions';
import {
    App, remoteBookId, bookLocator, locationCurrent,
    locationPath, BookLocation, stringToPath, BookLocator, pathToString, locationToc, locationFootnote,
} from '../model';
import { assertNever, parsePartialUrl, ParsedUrl } from '../utils';

export function actionToUrl(action: Action | undefined, state: App): string | undefined {
    if (!action) {
        return undefined;
    }

    const { screen } = state;
    switch (action.type) {
        case 'navigateToBook':
            return blToUrl(action.payload);
        case 'openFootnote':
            if (screen.screen === 'book' && action.payload) {
                // TODO: implement footnote location
                return blToUrl(
                    bookLocator(screen.bl.id,
                        locationFootnote(action.payload)));
            } else {
                return undefined;
            }
        case 'toggleToc':
            if (screen.screen === 'book') {
                // TODO: implement toc location
                return blToUrl(bookLocator(screen.bl.id, locationToc()));
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

    const path = parsedUrl.path.slice(2);
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
            return `${blToUrl(screen.bl)}`;
        default:
            return assertNever(screen);
    }
}

function locationForPath(path: string[]): BookLocation {
    const head = path[0];
    switch (head) {
        case 'current':
            return locationCurrent();
        case 'toc':
            return locationToc();
        case 'footnote':
            return path[1]
                ? locationFootnote(path[1])
                : locationPath([]); // TODO: report error ?
        default:
            return locationPath(stringToPath(head) || []);
    }
}

function blToUrl(bl: BookLocator): string {
    return `/book/${bl.id.name}/${locationToString(bl.location)}`;
}

function locationToString(l: BookLocation) {
    switch (l.location) {
        case 'path':
            return pathToString(l.path);
        case 'current':
            return 'current';
        case 'toc':
            return 'toc';
        case 'footnote':
            return `footnote/${l.id}`;
        default:
            return assertNever(l);
    }
}

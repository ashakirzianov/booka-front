import { Action, actionCreators } from '../redux';
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
                const loc = locationFootnote(action.payload, screen.bl.location.path);
                return blToUrl(
                    bookLocator(screen.bl.id, loc));
            } else {
                return undefined;
            }
        case 'toggleToc':
            if (screen.screen === 'book') {
                const loc = locationToc(screen.bl.location.path);
                return blToUrl(bookLocator(screen.bl.id, loc));
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
    const bl = parsedUrlToBL(parsedUrl);

    return bl && actionCreators.navigateToBook(bl);
}

function parsedUrlToBL(parsedUrl: ParsedUrl): BookLocator | undefined {
    const name = parsedUrl.path[1];
    if (!name) {
        return undefined; // TODO: report error ?
    }

    const path = parsedUrl.path.slice(2);
    const head = path[0];
    if (head === 'current') {
        return bookLocator(remoteBookId(name), locationCurrent());
    } else {
        const bookPath = stringToPath(head) || [];
        if (parsedUrl.search.toc !== undefined) {
            return bookLocator(remoteBookId(name), locationToc(bookPath));
        } else if (parsedUrl.search.fid !== undefined) {
            return bookLocator(remoteBookId(name), locationFootnote(parsedUrl.search.fid, bookPath));
        } else {
            return bookLocator(remoteBookId(name), locationPath(bookPath));
        }
    }
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
            return `${pathToString(l.path)}?toc`;
        case 'footnote':
            return `${pathToString(l.path)}?fid=${l.id}`;
        default:
            return assertNever(l);
    }
}

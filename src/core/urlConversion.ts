import { Action, actionCreators } from '../redux';
import {
    App, remoteBookId, bookLocator, locationCurrent,
    locationPath, BookLocation, stringToPath, BookLocator, pathToString,
} from '../model';
import { assertNever, parsePartialUrl, ParsedUrl, filterUndefined } from '../utils';

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
                const bl = {
                    ...screen.bl,
                    footnoteId: action.payload,
                };
                return blToUrl(bl);
            } else {
                return undefined;
            }
        case 'toggleToc':
            if (screen.screen === 'book') {
                const bl = {
                    ...screen.bl,
                    toc: !screen.bl.toc,
                };
                return blToUrl(bl);
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
        const id = remoteBookId(name);
        const loc = locationPath(bookPath);
        const toc = parsedUrl.search.toc !== undefined;
        const footnoteId = parsedUrl.search.fid;
        return bookLocator(id, loc, toc, footnoteId);
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
    return `/book/${bl.id.name}/${locationToString(bl.location)}${search(bl)}`;
}

function search(bl: BookLocator): string {
    const toc = bl.toc ? 'toc' : undefined;
    const fid = bl.footnoteId ? `fid=${bl.footnoteId}` : undefined;

    const all = filterUndefined([toc, fid]).join('&');

    return all ? `?${all}` : '';
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

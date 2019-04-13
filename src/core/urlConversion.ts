import { Action, actionCreators } from '../redux';
import {
    App, remoteBookId, bookLocator, locationCurrent,
    locationPath, BookLocation, BookLocator,
    BookRange, BookId, locationNone, BookPath, bookRange,
} from '../model';
import { assertNever, parsePartialUrl, ParsedUrl, filterUndefined, frontendBase } from '../utils';

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
        const bookPath = parsePath(head);
        const loc = bookPath
            ? locationPath(bookPath)
            : locationNone();
        const id = remoteBookId(name);
        const toc = parsedUrl.search.toc !== undefined;
        const footnoteId = parsedUrl.search.fid;
        const quote = parseRange(parsedUrl.search.q);
        return bookLocator(id, loc, toc, footnoteId, quote);
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

export function generateQuoteLink(id: BookId, quote: BookRange) {
    return frontendBase() + blToUrl(bookLocator(id, locationNone(), false, undefined, quote));
}

function blToUrl(bl: BookLocator): string {
    return `/book/${bl.id.name}/${locationToString(bl.location)}${search(bl)}`;
}

function search(bl: BookLocator): string {
    const toc = bl.toc ? 'toc' : undefined;
    const fid = bl.footnoteId ? `fid=${bl.footnoteId}` : undefined;
    const q = bl.quote ? `q=${rangeToString(bl.quote)}` : undefined;

    const all = filterUndefined([toc, fid, q]).join('&');

    return all ? `?${all}` : '';
}

function locationToString(l: BookLocation) {
    switch (l.location) {
        case 'path':
            return pathToString(l.path);
        case 'current':
            return 'current';
        case 'none':
            return '';
        default:
            return assertNever(l);
    }
}

const RANGE_DELIM = '_';
const PATH_DELIM = '-';

function rangeToString(br: BookRange): string {
    return `${pathToString(br.start)}${br.end ? RANGE_DELIM + pathToString(br.end) : ''}`;
}

function parseRange(s: string | undefined): BookRange | undefined {
    if (!s) {
        return undefined;
    }

    const paths = s
        .split(RANGE_DELIM)
        .map(parsePath);

    if (paths[0] === undefined || paths.length > 2) {
        return undefined;
    }

    const start = paths[0];
    const end = paths[1];

    return bookRange(start, end);
}

function pathToString(path: BookPath | undefined): string {
    return path === undefined || path.length === 0 || (path.length === 1 && path[0] === 0)
        ? ''
        : `${path.join(PATH_DELIM)}`
        ;
}

function parsePath(pathString: string | undefined): BookPath | undefined {
    if (!pathString) {
        return undefined;
    }

    const path = pathString
        .split(PATH_DELIM)
        .map(pc => parseInt(pc, 10))
        ;
    return path.some(p => isNaN(p))
        ? undefined
        : path;
}

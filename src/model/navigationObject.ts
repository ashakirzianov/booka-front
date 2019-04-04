import { ParsedUrl } from '../parseUrl';
import { BookId, BookPath, remoteBookId, BookLocator } from './bookLocator';

export type ToLibrary = {
    navigate: 'library',
};

export type ToBook = {
    navigate: 'book',
    id: BookId,
    location: BookLocation,
    toc: boolean,
    footnoteId: string | undefined,
};

export type ToUnknown = {
    navigate: 'unknown',
};

export type ToDefault = {
    navigate: 'default',
};

export type NavigationObject = ToLibrary | ToBook | ToDefault | ToUnknown;

export type StaticLocation = {
    location: 'static',
    path?: BookPath,
};

export type CurrentLocation = {
    location: 'current',
};

export type BookLocation = StaticLocation | CurrentLocation;

export function urlToNavigation(url: ParsedUrl): NavigationObject {
    const head = url.path[0];
    switch (head) {
        case '':
            return { navigate: 'default' };
        case 'library':
            return { navigate: 'library' };
        case 'book':
            return urlToBookNavigation(url);
        default:
            return { navigate: 'unknown' };
    }
}

function urlToBookNavigation(url: ParsedUrl): NavigationObject {
    const name = url.path[1];
    if (!name) {
        return { navigate: 'unknown' };
    }

    const path = url.path[2];
    const location = locationForPath(path);

    return {
        navigate: 'book',
        id: remoteBookId(name),
        location: location,
        toc: url.search.toc !== undefined,
        footnoteId: url.search.fid,
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

export function noForBl(bl: BookLocator): NavigationObject {
    return {
        navigate: 'book',
        location: {
            location: 'static',
            path: bl.range.start,
        },
        id: bl.id,
        toc: false,
        footnoteId: undefined,
    };
}

export function noForCurrent(bi: BookId): NavigationObject {
    return {
        navigate: 'book',
        location: {
            location: 'current',
        },
        id: bi,
        toc: false,
        footnoteId: undefined,
    };
}

export function noForLib(): NavigationObject {
    return {
        navigate: 'library',
    };
}

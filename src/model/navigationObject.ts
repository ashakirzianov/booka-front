import { BookId, BookPath, BookLocator } from './bookLocator';
import { BookScreen } from './screen';

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

export function noForBl(bl: BookLocator): NavigationObject {
    return {
        navigate: 'book',
        location: {
            location: 'static',
            path: bl.path,
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

export function noForBookScreen(bs: BookScreen): ToBook {
    return {
        navigate: 'book',
        id: bs.bl.id,
        location: {
            location: 'static',
            path: bs.bl.path,
        },
        footnoteId: undefined,
        toc: false,
    };
}

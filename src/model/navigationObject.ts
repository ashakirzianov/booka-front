import { BookId, BookPath, BookLocator } from './bookLocator';
import { BookScreen } from './screen';

export type ToLibrary = {
    navigate: 'library',
};

export type ToBook = {
    navigate: 'book',
    id: BookId,
    location: BookNavigation,
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

export type StaticNavigation = {
    location: 'static',
    path?: BookPath,
};

export type CurrentNavigation = {
    location: 'current',
};

export type BookNavigation = StaticNavigation | CurrentNavigation;

export function noForBl(bl: BookLocator): NavigationObject {
    const location: BookNavigation = bl.location.location === 'path'
        ? { location: 'static', path: bl.location.path }
        : { location: 'current' };
    return {
        navigate: 'book',
        location,
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
    const bl = bs.bl;
    const location: BookNavigation = bl.location.location === 'path'
        ? { location: 'static', path: bl.location.path }
        : { location: 'current' };
    return {
        navigate: 'book',
        id: bs.bl.id,
        location,
        footnoteId: undefined,
        toc: false,
    };
}

import { BookPath } from './bookRange';

export type RemoteBookId = {
    name: string,
};
export type BookId = RemoteBookId;
export function sameId(bi1: BookId, bi2: BookId): boolean {
    return bi2.name === bi1.name;
}

export function remoteBookId(name: string): RemoteBookId {
    return {
        name: name,
    };
}

export type BookLocation =
    | ReturnType<typeof locationPath>
    | ReturnType<typeof locationCurrent>
    | ReturnType<typeof locationToc>
    | ReturnType<typeof locationFootnote>
    ;

export function locationPath(path: BookPath) {
    return {
        location: 'path' as 'path',
        path,
    };
}

export function locationCurrent() {
    return {
        location: 'current' as 'current',
    };
}

export function locationToc() {
    return {
        location: 'toc' as 'toc',
    };
}

export function locationFootnote(id: string) {
    return {
        location: 'footnote' as 'footnote',
        id,
    };
}

export type BookLocator = {
    id: BookId,
    location: BookLocation,
};

export type BookPositionStore = {
    [bi in string]?: BookPath;
};

export function bookLocator(id: BookId, location?: BookLocation): BookLocator {
    return {
        id: id,
        location: location || locationPath([]),
    };
}

export function pointToSameBook(bl1: BookLocator, bl2: BookLocator): boolean {
    return sameId(bl1.id, bl2.id);
}

export function updatePath(bl: BookLocator, path: BookPath): BookLocator {
    return bookLocator(bl.id, locationPath(path));
}

export function updateLocation(bl: BookLocator, location: BookLocation): BookLocator {
    return {
        ...bl,
        location,
    };
}

import { BookPath, BookRange } from './bookRange';

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
    | ReturnType<typeof locationNone>
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

export function locationNone() {
    return {
        location: 'none' as 'none',
    };
}

export type BookLocator = {
    id: BookId,
    toc: boolean,
    footnoteId: string | undefined,
    location: BookLocation,
    quote?: BookRange,
};

export function bookLocator(id: BookId, location: BookLocation, toc?: boolean, footnoteId?: string, quote?: BookRange): BookLocator {
    return {
        id: id,
        toc: toc === true ? true : false,
        footnoteId,
        location: location || locationPath([]),
        quote,
    };
}

export function pointToSameBook(bl1: BookLocator, bl2: BookLocator): boolean {
    return sameId(bl1.id, bl2.id);
}

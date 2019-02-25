export type RemoteBookId = {
    bl: 'remote-book',
    name: string,
};
export type NotABookId = {
    bl: 'not-book',
};
export type BookId = RemoteBookId | NotABookId;
export function sameId(bi1: BookId, bi2: BookId): boolean {
    return bi1.bl === 'remote-book'
        ? bi2.bl === 'remote-book' && bi2.name === bi1.name
        : false;
}

export type BookPath = number[];
export type BookRange = {
    start: BookPath,
    end?: BookPath,
};

export function range(start?: BookPath, end?: BookPath): BookRange {
    return {
        start: start || [],
        end: end,
    };
}
export function appendPath(head: number, tail: BookPath): BookPath {
    return [head].concat(tail);
}

export function emptyPath(): BookPath {
    return [];
}

export function samePath(p1: BookPath, p2: BookPath) {
    return p1.length === p2.length
        && p1.every((p1c, idx) => p1c === p2[idx])
        ;
}

export type BookLocator = {
    id: BookId,
    range: BookRange,
};

export function bookLocator(id: BookId, start?: BookPath, end?: BookPath): BookLocator {
    return {
        id: id,
        range: range(start, end),
    };
}

export function remoteBookLocator(name: string, path?: BookPath): BookLocator {
    return {
        id: {
            bl: 'remote-book',
            name: name,
        },
        range: range(path),
    };
}

export function pointToSameBook(bl1: BookLocator, bl2: BookLocator): boolean {
    return sameId(bl1.id, bl2.id);
}

export function updatePath(bl: BookLocator, path: BookPath): BookLocator {
    return {
        ...bl,
        range: {
            ...bl.range,
            start: path,
        },
    };
}

export function stringToBL(str: string): BookLocator | undefined {
    const matches = str.match(/([\w-]+)(\/((\d+-?)+))?/);
    if (!matches) {
        return undefined;
    }
    const bookName = matches[1];
    const pathString = matches[3];
    if (pathString) {
        const path = pathString
            .split('-')
            .map(pc => parseInt(pc, 10))
            ;
        return remoteBookLocator(bookName, path);
    }

    return remoteBookLocator(bookName);
}

export function blToString(bl: BookLocator): string {
    return `${biToString(bl.id)}${rangeToString(bl.range)}`;
}

export function biToString(bi: BookId): string {
    return bi.bl === 'remote-book'
        ? bi.name
        : '@not-a-book'; // TODO: better solution
}

export function rangeToString(br: BookRange): string {
    return `${pathToString(br.start)}${br.end ? ':' + pathToString(br.end) : ''}`;
}

function pathToString(path: BookPath): string {
    return path.length === 0 || (path.length === 1 && path[0] === 0)
        ? ''
        : `/${path.join('-')}`
        ;
}

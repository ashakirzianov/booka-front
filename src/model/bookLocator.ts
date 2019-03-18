export type RemoteBookId = {
    bi: 'remote-book',
    name: string,
};
export type NotABookId = {
    bi: 'not-book',
};
export type BookId = RemoteBookId | NotABookId;
export function sameId(bi1: BookId, bi2: BookId): boolean {
    return bi1.bi === 'remote-book'
        ? bi2.bi === 'remote-book' && bi2.name === bi1.name
        : false;
}

export function remoteBookId(name: string): RemoteBookId {
    return {
        bi: 'remote-book',
        name: name,
    };
}

export type BookPath = number[];

export function emptyPath(): BookPath {
    return [];
}

export function appendPath(head: number, tail: BookPath): BookPath {
    return [head].concat(tail);
}

export function samePath(p1: BookPath, p2: BookPath) {
    return p1.length === p2.length
        && p1.every((p1c, idx) => p1c === p2[idx])
        ;
}

export function pathLessThan(left: BookPath, right: BookPath): boolean {
    const longerLength = Math.max(left.length, right.length);
    for (let idx = 0; idx < longerLength; idx++) {
        const leftElement = left[idx] || 0;
        const rightElement = right[idx] || 0;
        if (leftElement !== rightElement) {
            return leftElement < rightElement;
        }
    }

    return false;
}

export type BookRange = {
    start: BookPath,
    end?: BookPath,
};

export function bookRange(start?: BookPath, end?: BookPath): BookRange {
    return {
        start: start || [],
        end: end,
    };
}

export function inRange(path: BookPath, range: BookRange): boolean {
    return !pathLessThan(path, range.start) && !(range.end && pathLessThan(range.end, path));
}

export type BookLocator = {
    id: BookId,
    range: BookRange,
};

export function bookLocator(id: BookId, start?: BookPath, end?: BookPath): BookLocator {
    return {
        id: id,
        range: bookRange(start, end),
    };
}

export function pointToSameBook(bl1: BookLocator, bl2: BookLocator): boolean {
    return sameId(bl1.id, bl2.id);
}

export function updateRangeStart(bl: BookLocator, path: BookPath): BookLocator {
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
        return bookLocator(remoteBookId(bookName), path);
    }

    return bookLocator(remoteBookId(bookName));
}

export function blToString(bl: BookLocator): string {
    return `${biToString(bl.id)}${rangeToString(bl.range)}`;
}

export function biToString(bi: BookId): string {
    return bi.bi === 'remote-book'
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

export type BookPath = number[];

export function leadPath(): BookPath {
    return [0];
}

export function emptyPath(): BookPath {
    return [];
}

export function pathHead(path: BookPath): number | undefined {
    return path[0];
}

export function pathTail(path: BookPath) {
    return path.slice(1);
}

export function parentPath(path: BookPath) {
    return path.slice(0, path.length - 1);
}

export function appendPath(path: BookPath, last: number): BookPath {
    return path.concat([last]);
}

export function samePath(p1: BookPath, p2: BookPath) {
    return p1.length === p2.length
        && p1.every((p1c, idx) => p1c === p2[idx])
        ;
}

export function pathLessThan(left: BookPath, right: BookPath): boolean {
    for (let idx = 0; idx < right.length; idx++) {
        const leftElement = left[idx];
        const rightElement = right[idx];
        if (leftElement === undefined) {
            return true;
        }
        if (leftElement !== rightElement) {
            return leftElement < rightElement;
        }
    }

    return false;
}

export function isPrefix(left: BookPath, right: BookPath) {
    if (left.length <= right.length) {
        return left.every((p, i) => p === right[i]);
    } else {
        return false;
    }
}

export function isFirstSubpath(left: BookPath, right: BookPath) {
    if (!isPrefix(left, right)) {
        return false;
    }

    return right
        .slice(left.length)
        .every(p => p === 0);
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

export function bookRangeUnordered(f: BookPath, s: BookPath): BookRange {
    if (pathLessThan(s, f)) {
        return bookRange(s, f);
    } else {
        return bookRange(f, s);
    }
}

export function inRange(path: BookPath, range: BookRange): boolean {
    if (pathLessThan(path, range.start)) {
        return false;
    }
    if (range.end && !pathLessThan(path, range.end)) {
        return false;
    }

    return true;
}

export function subpathCouldBeInRange(path: BookPath, range: BookRange): boolean {
    if (range.end && !pathLessThan(path, range.end)) {
        return false;
    }

    const part = range.start.slice(0, path.length);
    const could = !pathLessThan(path, part);
    return could;
}

export const RANGE_DELIM = '_';
export const PATH_DELIM = '-';

export function rangeToString(br: BookRange): string {
    return `${pathToString(br.start)}${br.end ? RANGE_DELIM + pathToString(br.end) : ''}`;
}

export function parseRange(s: string | undefined): BookRange | undefined {
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

export function pathToString(path: BookPath | undefined): string {
    return path === undefined || path.length === 0 || (path.length === 1 && path[0] === 0)
        ? ''
        : `${path.join(PATH_DELIM)}`
        ;
}

export function parsePath(pathString: string | undefined): BookPath | undefined {
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

import { Range, inRange, TaggedRange } from '../utils';

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

export function incrementPath(path: BookPath, inc: number): BookPath {
    const result = path.slice();
    result[path.length - 1] += inc;

    return result;
}

export function appendPath(path: BookPath, last: number): BookPath {
    return path.concat([last]);
}

export function samePath(p1: BookPath, p2: BookPath) {
    return p1.length === p2.length
        && p1.every((p1c, idx) => p1c === p2[idx])
        ;
}

export function sameParent(p1: BookPath, p2: BookPath) {
    return p1.length === p2.length
        && p1.every((p1c, idx) => p1c === p2[idx] || idx === p1.length - 1)
        ;
}

export function comparePaths(left?: BookPath, right?: BookPath): number {
    if (left === undefined) {
        return right === undefined ? 0 : 1;
    } else if (right === undefined) {
        return -1;
    }
    for (let idx = 0; idx < right.length; idx++) {
        const leftElement = left[idx];
        const rightElement = right[idx];
        if (leftElement === undefined) {
            return rightElement === undefined
                ? 0
                : -1;
        }
        if (leftElement !== rightElement) {
            return leftElement < rightElement
                ? -1
                : +1;
        }
    }

    return 0;
}

export function pathLessThan(left: BookPath, right: BookPath): boolean {
    return comparePaths(left, right) === -1;
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

export type BookRange = Range<BookPath>;

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

export function inBookRange(path: BookPath, range: BookRange): boolean {
    return inRange(path, range, pathLessThan);
}

export function subpathCouldBeInRange(path: BookPath, range: BookRange): boolean {
    if (range.end && !pathLessThan(path, range.end)) {
        return false;
    }

    const part = range.start.slice(0, path.length);
    const could = !pathLessThan(path, part);
    return could;
}

export function isOverlap(left: BookRange, right: BookRange): boolean {
    const [first, second] = pathLessThan(left.start, right.start)
        ? [left, right]
        : [right, left];

    return first.end === undefined || !pathLessThan(first.end, second.start);
}

export function overlapWith<T>(r: BookRange, tagged: Array<TaggedRange<T, BookPath>>) {
    const result = tagged.filter(tr => isOverlap(r, tr.range));

    return result;
}

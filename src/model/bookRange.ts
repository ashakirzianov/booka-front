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

export function isOverlap(left: BookRange, right: BookRange): boolean {
    const [first, second] = pathLessThan(left.start, right.start)
        ? [left, right]
        : [right, left];

    return first.end === undefined || !pathLessThan(first.end, second.start);
}

export type TaggedRange<T> = {
    tag: T,
    range: BookRange,
};
export function* overlaps<T>(taggedRanges: Array<TaggedRange<T>>) {
    const sorted = taggedRanges
        .sort((a, b) =>
            comparePaths(a.range.start, b.range.start));

    let prev = sorted[0];
    for (let idx = 1; idx < sorted.length; idx++) {
        const curr = sorted[idx];
        if (comparePaths(prev.range.end, curr.range.start) <= 0) {
            yield prev;
            prev = curr;
        } else {
            yield {
                tag: prev.tag,
                range: bookRange(prev.range.start, curr.range.start),
            };
            if (comparePaths(prev.range.end, curr.range.end) <= 0) {
                prev = curr;
            } else {
                yield curr;
                prev = {
                    ...prev,
                    range: bookRange(curr.range.end, prev.range.end),
                };
            }
        }
    }

    yield prev;
}

import { distinct } from './misc';

export type Range<T> = {
    start: T,
    end?: T,
};
export function range<T>(start: T, end?: T) {
    return { start, end };
}

export function inRange<T>(point: T, r: Range<T>, lessThanF: (l: T, r: T) => boolean) {
    if (!lessThanF(point, r.start)) {
        if (r.end === undefined || lessThanF(point, r.end)) {
            return true;
        }
    }

    return false;
}
export type TaggedRange<T, U = number> = {
    tag: T | undefined,
    range: Range<U>,
};
export function overlaps<T, U = number>(taggedRanges: Array<TaggedRange<T, U>>, lessThanF: (l: U, r: U) => boolean) {
    let isEndInfinity = false;
    const points = distinct(taggedRanges.reduce<U[]>(
        (pts, tagged) => {
            pts.push(tagged.range.start);
            if (tagged.range.end) {
                pts.push(tagged.range.end);
            } else {
                isEndInfinity = true;
            }

            return pts;
        }, []))
        .sort((a, b) => lessThanF(a, b) ? -1 : +1);

    const result: Array<{
        tag: T[],
        range: Range<U>,
    }> = [];
    const lastIndex = isEndInfinity
        ? points.length + 1
        : points.length;
    for (let idx = 1; idx < lastIndex; idx++) {
        const prevPoint = points[idx - 1];
        const point = points[idx];
        const tags = taggedRanges
            .filter(tr => inRange(prevPoint, tr.range, lessThanF))
            .map(tr => tr.tag)
            .reduce<T[]>((acc, ts) => ts !== undefined ? acc.concat(ts) : acc, []);
        result.push({
            tag: tags,
            range: {
                start: prevPoint,
                end: point,
            },
        });
    }

    return result;
}

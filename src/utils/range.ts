import { distinct } from 'booka-common';

export type Range = {
    start: number,
    end?: number,
};
export function range<T>(start: T, end?: T) {
    return { start, end };
}

export function inRange(point: number, r: Range) {
    if (point >= r.start) {
        if (r.end === undefined || point < r.end) {
            return true;
        }
    }

    return false;
}
export type TaggedRange<T> = {
    tag: T | undefined,
    range: Range,
};
export function overlaps<T>(taggedRanges: Array<TaggedRange<T>>) {
    let isEndInfinity = false;
    const points = distinct(taggedRanges.reduce<number[]>(
        (pts, tagged) => {
            pts.push(tagged.range.start);
            if (tagged.range.end) {
                pts.push(tagged.range.end);
            } else {
                isEndInfinity = true;
            }

            return pts;
        }, []))
        .sort((a, b) => a < b ? -1 : +1);

    const result: Array<{
        tag: T[],
        range: Range,
    }> = [];
    const lastIndex = isEndInfinity
        ? points.length + 1
        : points.length;
    for (let idx = 1; idx < lastIndex; idx++) {
        const prevPoint = points[idx - 1];
        const point = points[idx];
        const tags = taggedRanges
            .filter(tr => inRange(prevPoint, tr.range))
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

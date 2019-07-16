// TODO: add some comment explaining whe we need this type. It's a bit cryptic.
export type KeyRestriction<T, U extends PropertyKey> = {
    [k in U]?: never;
} & {
        [k in U]?: undefined;
    } & {
        [k in keyof T]: T[k];
    };

export type PromiseType<T> = T extends Promise<infer U> ? U : any;

export type ExcludeKeys<T, K extends PropertyKey> = Pick<T, Exclude<keyof T, K>>;

export type Func<Argument, Return> = void extends Argument
    ? () => Return
    : (payload: Argument) => Return;

export type Defined<T> = T extends undefined ? never : T;
export type MaybeLazy<T> = T | (() => T);
export function lazyValue<T>(v: MaybeLazy<T> | undefined): T | undefined {
    if (v === undefined) {
        return v;
    }

    return typeof v === 'function'
        ? (v as any)()
        : v;
}

export function letExp<T, U>(x: T, f: (x: T) => U) {
    return f(x);
}

export function throwExp<T>(error: T): never {
    throw error;
}

export function assertNever(arg: never, message?: string): never {
    throw new Error(`Should have not happen: ${message} (object: ${arg})`);
}

export function combineF<S, T, U>(f: (x: T) => U, g: (x: S) => T) {
    return (x: S) => f(g(x));
}

export function combineFs<T>(...fs: Array<(x: T) => T>) {
    return fs.reduce((acc, f) => combineF(acc, f));
}

export function keys<T>(obj: T): Array<keyof T> {
    return Object.keys(obj) as Array<keyof T>;
}

export function mapObject<T, U>(
    obj: T,
    f: <K extends keyof T, V extends T[K]>(k: K, v: V) => U
): { [k in keyof T]: U } {
    return keys(obj).reduce((acc, key) =>
        ({ ...acc, [key]: f(key, obj[key]) }), {} as any); // NOTE: need to cast so reducer infer 'any' as type arg
}

export function pick<T, Keys extends keyof T>(obj: T, ...ks: Keys[]): Pick<T, Keys> {
    return ks.reduce((ret, key) => ({ ...ret, [key]: obj[key] }), {}) as Pick<T, Keys>;
}

export function def<T = void>() {
    return {} as any as T;
}

export function defOpt<T>() {
    return def<T | undefined>();
}

export function timeouted<U>(f: () => U, timeout?: number): () => Promise<U>;
export function timeouted<T, U>(f: (x: T) => U, timeout?: number): (x: T) => Promise<U>;
export function timeouted<T, U>(f: (x: T) => U, timeout: number = 500): (x: T) => Promise<U> {
    return (x: T) => new Promise((res, rej) => {
        setTimeout(() => {
            try {
                const result = f(x);
                res(result);
            } catch (err) {
                rej(err);
            }
        }, timeout);
    });
}

export function filterUndefined<T>(arr: Array<T | undefined>): T[] {
    return arr.filter(e => e !== undefined) as T[];
}

// String

export function isWhitespaces(input: string): boolean {
    return input.match(/^\s*$/) ? true : false;
}

export function trimStart(input: string, trimSet: string) {
    return input.replace(new RegExp(`([${trimSet}]*)(.*)`), '$2');
}

export function trimEnd(input: string, trimSet: string) {
    return trimStart(input.split('').reverse().join(''), trimSet)
        .split('').reverse().join('');
}

export function trim(input: string, trimSet: string) {
    return trimEnd(trimStart(input, trimSet), trimSet);
}

export function trimNewLines(line: string) {
    return trim(line, '\n');
}

export function caseInsensitiveEq(left: string, right: string) {
    return left.localeCompare(right, undefined, { sensitivity: 'base' }) === 0;
}

export function caseSensitiveEq(left: string, right: string) {
    return left.localeCompare(right) === 0;
}

export function bite(from: string, prefix: string): string | undefined {
    return from.startsWith(prefix)
        ? from.substring(prefix.length)
        : undefined;
}

export function nums(start: number, end: number): number[] {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}

export function compose<T, U, V>(f: (x: T) => U, g: (x: U) => V): (x: T) => V {
    return x => g(f(x));
}

type ObjectMap<V, K extends PropertyKey = string> = {
    [k in K]?: V;
};
export function values<V>(obj: ObjectMap<V>): V[] {
    return Object.values(obj) as any;
}

export function forEach<V>(obj: ObjectMap<V>, f: (key: string, value: V) => void) {
    return Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (value !== undefined) {
            f(key, value);
        }
    });
}

export async function delay(timeout: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export function last<T>(arr: T[]): T {
    return arr[arr.length - 1];
}

export function firstDefined<T, U>(arr: T[], f: (x: T) => U | undefined): U | undefined {
    for (const i of arr) {
        const result = f(i);
        if (result !== undefined) {
            return result;
        }
    }

    return undefined;
}

export function distinct<T>(arr: T[]): T[] {
    return arr.reduce<T[]>((res, x) => {
        if (!res.some(xx => xx === x)) {
            res.push(x);
        }

        return res;
    }, []);
}

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
        .sort();

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

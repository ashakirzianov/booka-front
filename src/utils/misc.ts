// TODO: move most of this to 'common'

export function nums(start: number, end: number): number[] {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}

export type MaybeLazy<T> = T | (() => T);
export function lazyValue<T>(v: MaybeLazy<T> | undefined): T | undefined {
    if (v === undefined) {
        return v;
    }

    return typeof v === 'function'
        ? (v as any)()
        : v;
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

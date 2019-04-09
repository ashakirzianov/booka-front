export function isDebug() {
    return process.env.NODE_ENV !== 'production';
}

export function debug(f: () => void) {
    if (isDebug()) {
        f();
    }
}

type DebugValue<T> = {
    default?: T,
    debug?: T,
    production?: T,
};

export function debugValue<T>(pv: { default: T } & Partial<DebugValue<T>>): T;
export function debugValue<T, U>(pv: { debug: T, production: U }): T | U;
export function debugValue<T>(pv: DebugValue<T>): T | undefined {
    if (isDebug()) {
        return pv.debug || pv.default;
    } else {
        return pv.production || pv.default;
    }
}

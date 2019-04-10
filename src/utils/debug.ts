export function isDebug() {
    return process.env.NODE_ENV === 'development';
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

export function debugBackendBase() {
    // const result = 'http://localhost:3042/';
    // TODO: this is not reliable solution, think of something else
    const result = 'http://192.168.1.190:3042/';

    return result;
}

export function noOp() { return; }

function logDebug(msg: string) {
    // tslint:disable-next-line:no-console
    console.log(msg);
}

export const log = debugValue({
    debug: logDebug,
    production: noOp,
});

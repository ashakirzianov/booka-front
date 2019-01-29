export type PromisePlus<T, Data = undefined> = {
    promise: Promise<T>,
    data: Data,
}

export function promisePlus<T, D>(promise: Promise<T>, data: D): PromisePlus<T, D> {
    return {
        promise: promise,
        data: data,
    };
}
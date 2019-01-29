export type PromisePlus<T, Data = undefined> = {
    promise: Promise<T>,
    data: Data,
}

export type OptimisticPromise<T> = PromisePlus<T, T>;

export function promisePlus<T, D>(promise: Promise<T>, data: D): PromisePlus<T, D> {
    return {
        promise: promise,
        data: data,
    };
}

export function optimisticPromise<T>(promise: Promise<T>, guess: T): OptimisticPromise<T> {
    return promisePlus(promise, guess);
}

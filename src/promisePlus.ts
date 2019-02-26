export type PromisePlus<T, Data = undefined> = {
    promise: Promise<T>,
    data: Data,
};

export type OptimisticPromise<T> = PromisePlus<T, T>;

export function promisePlus<T, D>(promise: Promise<T>, data: D): PromisePlus<T, D> {
    return {
        promise: promise,
        data: data,
    };
}

export function optimisticPromise<T>(guess: T, promise: Promise<T>): OptimisticPromise<T> {
    return promisePlus(promise, guess);
}

export function then<T, U>(promise: OptimisticPromise<T>, thenF: (x: T) => U): OptimisticPromise<U> {
    return optimisticPromise<U>(thenF(promise.data), promise.promise.then(thenF));
}

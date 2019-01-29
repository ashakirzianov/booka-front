const fatSymbol = Symbol();
export interface FatPromise<Return, Fat> extends Promise<Return> {
    [fatSymbol]: Fat,
}

export function addFat<R, T>(promise: Promise<R>, fat: T): FatPromise<R, T> {
    let fatPromise = promise as FatPromise<R, T>;
    fatPromise[fatSymbol] = fat;

    return fatPromise;
}

export function fat<R, T>(fatPromise: FatPromise<R, T>): T {
    return fatPromise[fatSymbol];
}

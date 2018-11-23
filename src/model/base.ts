export type Loading = { loading: true };
export type Loadable<T> = T | Loading;

export function loading(): Loading {
    return {
        loading: true,
    };
}

export function isLoading(obj: any): obj is Loading {
    return obj.loading === true;
}
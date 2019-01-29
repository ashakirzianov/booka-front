export type NoBookLocator = { bl: 'no-book' };
export type ErrorBookLocator = { bl: 'error-book' } // TODO: rethink and, perhaps, remove?
export type StaticBookLocator = {
    bl: 'static-book',
    name: string,
};

export type BookLocator = 
    | NoBookLocator
    | StaticBookLocator
    | ErrorBookLocator
    ;

export function noBookLocator(): NoBookLocator {
    return {
        bl: 'no-book',
    };
}

export function errorBookLocator(): ErrorBookLocator {
    return {
        bl: 'error-book',
    };
}

export function staticBookLocator(name: string): StaticBookLocator {
    return {
        bl: 'static-book',
        name: name,
    };
}

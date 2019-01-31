export type NoBookLocator = { bl: 'no-book' };
export type ErrorBookLocator = { bl: 'error-book' } // TODO: rethink and, perhaps, remove?
export type RemoteBookLocator = {
    bl: 'remote-book',
    name: string,
};

export type BookLocator = 
    | NoBookLocator
    | RemoteBookLocator
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

export function remoteBookLocator(name: string): RemoteBookLocator {
    return {
        bl: 'remote-book',
        name: name,
    };
}

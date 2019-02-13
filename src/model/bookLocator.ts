export type RemoteBookLocator = {
    bl: 'remote-book',
    name: string,
    path: BookPath,
};
export type BookPath = number[];
export function appendPath(head: number, tail: BookPath): BookPath {
    return [head].concat(tail);
}

export function emptyPath(): BookPath {
    return [];
}

export type BookLocator = RemoteBookLocator;

export function remoteBookLocator(name: string, path?: BookPath): RemoteBookLocator {
    return {
        bl: 'remote-book',
        name: name,
        path: path || [],
    };
}

export function pointToSameBook(bl1: BookLocator, bl2: BookLocator): boolean {
    return bl1.bl === bl2.bl && bl1.name === bl2.name;
}

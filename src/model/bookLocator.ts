export type RemoteBookLocator = {
    bl: 'remote-book',
    name: string,
};

export type BookLocator = RemoteBookLocator;

export function remoteBookLocator(name: string): RemoteBookLocator {
    return {
        bl: 'remote-book',
        name: name,
    };
}

export function pointToSameBook(bl1: BookLocator, bl2: BookLocator): boolean {
    return bl1.bl === bl2.bl && bl1.name === bl2.name;
}

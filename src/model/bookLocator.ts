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

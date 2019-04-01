import { BookPath, BookId } from './bookLocator';

export type Syncable = {
    positionStore: BookPositionStore,
};

export type BookPositionStore = {
    [bi in string]?: BookPath;
};

export type BookPosition = {
    id: BookId,
    path: BookPath,
};

export function updateBookPosition(syncable: Syncable, bookPosition: BookPosition): Syncable {
    return {
        ...syncable,
        positionStore: {
            ...syncable.positionStore,
            [bookPosition.id.name]: bookPosition.path,
        },
    };
}

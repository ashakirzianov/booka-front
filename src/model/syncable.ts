import { BookPath } from './bookLocator';

export type Syncable = {
    positionStore: BookPositionStore,
};

export type BookPositionStore = {
    [bi in string]?: BookPath;
};

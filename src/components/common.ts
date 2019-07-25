import { BookPath } from '../model';
import { RefType } from '../blocks';
import { buildConnectRedux } from '../utils';
import { App } from '../model';
import { actionCreators } from '../core';

const connects = buildConnectRedux<App, typeof actionCreators>(actionCreators);
export const connect = connects.connect;
export const connectAll = connects.connectAll;
export const connectState = connects.connectState;
export const connectActions = connects.connectActions;

export type RefPathHandler = (ref: RefType, path: BookPath) => void;

export function pathToId(path: BookPath): string {
    return `id:${pathToString(path)}`;
}

export function idToPath(str: string): BookPath | undefined {
    const comps = str.split(':');
    if (comps.length !== 2 || comps[0] !== 'id') {
        return undefined;
    }
    const path = parsePath(comps[1]);

    return path;
}

export function pathToString(path: BookPath): string {
    return `${path.join('-')}`;
}

export function parsePath(pathString: string): BookPath | undefined {
    const path = pathString
        .split('-')
        .map(pc => parseInt(pc, 10))
        ;
    return path.some(p => isNaN(p))
        ? undefined
        : path;
}

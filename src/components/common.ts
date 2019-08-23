import { BookPath } from 'booka-common';
import { RefType } from '../blocks';

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

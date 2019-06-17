import { BookPath } from '../model';
import { pathToString, parsePath } from './bookRender';

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
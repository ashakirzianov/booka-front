import { BookPath, appendPath, emptyPath, pathHead, pathTail } from './bookLocator';
import { BookNode, BookContent, children } from './bookContent';

export type RootIterator = {
    firstChildren: BookIteratorHandler,
};
export type BookIterator = RootIterator & {
    node: BookNode,
    index: number,
    parent: BookIteratorHandler,
    prevSibling: BookIteratorHandler,
    nextSibling: BookIteratorHandler,
};
export type OptBookIterator = BookIterator | undefined;
type BookIteratorHandler = () => OptBookIterator;
function isBookIterator(i: RootIterator): i is BookIterator {
    return (i as any).node !== undefined;
}

export function bookIterator(book: BookContent): RootIterator {
    return {
        firstChildren: siblingIterator(undefined, book.content, 0),
    };
}

export function iterateToPath(iterator: RootIterator, path: BookPath): OptBookIterator {
    const head = pathHead(path);
    if (!head) {
        return isBookIterator(iterator) ? iterator : undefined;
    } else {
        const next = nthSibling(iterator.firstChildren(), head);
        const tail = pathTail(path);
        return next ? iterateToPath(next, tail) : undefined;
    }
}

export function nthSibling(iterator: OptBookIterator, n: number): OptBookIterator {
    if (!iterator || n === 0) {
        return iterator;
    } else {
        return n > 0
            ? nthSibling(iterator.nextSibling(), n - 1)
            : nthSibling(iterator.prevSibling(), n + 1);
    }
}

function siblingIterator(parent: OptBookIterator, siblings: BookNode[], idx: number): BookIteratorHandler {
    return () => {
        if (idx < siblings.length && idx >= 0) {
            const node = siblings[idx];
            const iterator: BookIterator = {
                node,
                index: idx,
                parent: () => parent,
                nextSibling: siblingIterator(parent, siblings, idx + 1),
                prevSibling: siblingIterator(parent, siblings, idx - 1),
                firstChildren: () => undefined, // TODO: implement
            };

            const ch = children(node);
            if (ch.length > 0) {
                iterator.firstChildren = siblingIterator(iterator, ch, 0);
            }

            return iterator;
        } else {
            return undefined;
        }
    };
}

export function nextIterator(i: OptBookIterator): OptBookIterator {
    if (!i) {
        return i;
    }
    const nextSibling = i.nextSibling();
    if (nextSibling) {
        return nextSibling;
    } else {
        return nextIterator(i.parent());
    }
}

export function prevIterator(i: OptBookIterator): OptBookIterator {
    if (!i) {
        return i;
    }
    const prevSibling = i.prevSibling();
    if (prevSibling) {
        return prevSibling;
    } else {
        return prevIterator(i.parent());
    }
}

export function buildPath(i: OptBookIterator): BookPath {
    return i ? appendPath(buildPath(i.parent()), i.index) : emptyPath();
}

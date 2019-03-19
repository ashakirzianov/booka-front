import { BookPath, appendPath, emptyPath, pathHead, pathTail } from './bookLocator';
import { BookNode, BookContent, children } from './bookContent';

export type RootIterator = {
    node: undefined,
    firstChildren: BookIteratorHandler,
};
export type BookIterator = {
    node: BookNode,
    index: number,
    parent: ParentIterator,
    prevSibling: BookIteratorHandler,
    nextSibling: BookIteratorHandler,
    firstChildren: BookIteratorHandler,
};
export type OptBookIterator = BookIterator | undefined;
type ParentIterator = RootIterator | BookIterator;
type BookIteratorHandler = () => OptBookIterator;

export function bookIterator(book: BookContent): RootIterator {
    const p = {
        node: undefined,
        firstChildren: undefined as any,
    };
    p.firstChildren = siblingIterator(p, book.content, 0);
    return p;
}

export function iterateToPath(iterator: ParentIterator, path: BookPath): OptBookIterator {
    const head = pathHead(path);
    if (head === undefined) {
        return iterator.node ? iterator : undefined;
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

function siblingIterator(parent: ParentIterator, siblings: BookNode[], idx: number): BookIteratorHandler {
    return () => {
        if (idx < siblings.length && idx >= 0) {
            const node = siblings[idx];
            const iterator: BookIterator = {
                node,
                index: idx,
                parent: parent,
                nextSibling: siblingIterator(parent, siblings, idx + 1),
                prevSibling: siblingIterator(parent, siblings, idx - 1),
                firstChildren: () => undefined,
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

export function nextIterator(i: ParentIterator): OptBookIterator {
    if (!i.node) {
        return undefined;
    }
    const nextSibling = i.nextSibling();
    if (nextSibling) {
        return nextSibling;
    } else {
        return nextIterator(i.parent);
    }
}

export function prevIterator(i: ParentIterator): OptBookIterator {
    if (!i.node) {
        return undefined;
    }
    const prevSibling = i.prevSibling();
    if (prevSibling) {
        return prevSibling;
    } else {
        return prevIterator(i.parent);
    }
}

export function buildPath(i: ParentIterator): BookPath {
    return i.node ? appendPath(buildPath(i.parent), i.index) : emptyPath();
}
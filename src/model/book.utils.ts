import { BookNode, isChapter, isParagraph, BookContent } from './bookContent';
import { BookPath, BookRange, bookRange } from './bookRange';
import { assertNever } from '../utils';
import { iterateToPath, bookIterator, nextIterator, buildPath, OptBookIterator, OptParentIterator } from './bookIterator';
import { Footnote } from '../contracts';

export function footnoteForId(book: BookContent, id: string | null): Footnote | undefined {
    return book.footnotes
        .find(f => f.id === id);
}

export function computeRangeForPath(book: BookContent, path: BookPath): BookRange {
    const iterator = iterateToPath(bookIterator(book), path);
    const chapter = findChapterLevel(iterator);

    const nextChapter = nextIterator(chapter);

    const range = bookRange(
        buildPath(chapter),
        nextChapter && buildPath(nextChapter)
    );

    return range;
}

function findChapterLevel(i: OptParentIterator): OptBookIterator {
    if (!i || !i.node) {
        return undefined;
    }
    if (isChapter(i.node) && i.node.level === 0) {
        return i;
    } else {
        return findChapterLevel(i.parent);
    }
}

export function countToPath(nodes: BookNode[], path: BookPath): number {
    if (path.length > 0) {
        const head = path[0];
        const countFront = nodes
            .slice(0, head)
            .map(n => countElements(n))
            .reduce((total, curr) => total + curr, 0);

        const nextNode = nodes[head];
        if (isChapter(nextNode)) {
            return countFront + countToPath(nextNode.nodes, path.slice(1));
        } else {
            return countFront;
        }
    } else {
        return 1;
    }
}

function countElements(node: BookNode): number {
    if (isParagraph(node)) {
        return 1;
    } else if (isChapter(node)) {
        return 1 + node.nodes
            .map(n => countElements(n))
            .reduce((total, curr) => total + curr);
    } else {
        return assertNever(node);
    }
}

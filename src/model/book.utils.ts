import { ContentNode, isChapter, isParagraph, VolumeNode, Span } from './bookVolume';
import { BookPath, BookRange, bookRange } from './bookRange';
import { assertNever, firstDefined } from '../utils';
import {
    iterateToPath, bookIterator, nextIterator, buildPath,
    OptBookIterator, OptParentIterator,
} from './bookIterator';
import { FootnoteSpan, isSimple, isAttributed, isFootnote, isCompound, ChapterTitle } from '../contracts';

export function footnoteForId(book: VolumeNode, id: string): FootnoteSpan | undefined {
    return firstDefined(book.nodes, n => footnoteFromNode(n, id));
}

function footnoteFromNode(bookNode: ContentNode, id: string): FootnoteSpan | undefined {
    if (isChapter(bookNode)) {
        return firstDefined(bookNode.nodes, n => footnoteFromNode(n, id));
    } else if (isParagraph(bookNode)) {
        return footnoteFromSpan(bookNode.span, id);
    } else {
        return undefined;
    }
}

function footnoteFromSpan(span: Span, id: string): FootnoteSpan | undefined {
    if (isFootnote(span)) {
        return span.id === id
            ? span
            : undefined;
    } else if (isCompound(span)) {
        return firstDefined(span.spans, s => footnoteFromSpan(s, id));
    } else {
        return undefined;
    }
}

export function computeRangeForPath(book: VolumeNode, path: BookPath): BookRange {
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

export function countToPath(nodes: ContentNode[], path: BookPath): number {
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

function countElements(node: ContentNode): number {
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

export function titleForPath(book: VolumeNode, path: BookPath): ChapterTitle {
    if (path.length === 0) {
        return [book.meta.title];
    }

    const iter = bookIterator(book);
    const node = iterateToPath(iter, path);
    if (node) {
        if (isChapter(node.node)) {
            return node.node.title;
        } else {
            return [];
        }
    } else {
        return [];
    }
}

// TODO: fix !!!
export function pageForPath(book: VolumeNode, path: BookPath) {
    const page = pageForPathImpl(book.nodes, path, 1);

    return page || 1;
}

function pageForPathImpl(nodes: ContentNode[], path: BookPath, page: number): number | undefined {
    if (path.length === 0) {
        return page;
    }

    const head = path[0];
    const headNode = nodes[head];
    if (!headNode) {
        return undefined;
    }

    const before = nodes
        .slice(0, head)
        .reduce((len, n) => len + nodeLength(n), 0);
    const headPage = page + numberOfPages(before);
    if (isChapter(headNode)) {
        return pageForPathImpl(headNode.nodes, path.slice(1), headPage);
    } else if (isParagraph(headNode)) {
        if (path.length === 2) {
            return headPage;
        } else if (path.length === 1) {
            return headPage;
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}

export function pageForIterator(bookIter: OptParentIterator): number {
    if (!bookIter || bookIter.node === undefined) {
        return 1;
    }

    const prev = bookIter.prevSibling();
    if (prev) {
        const prevStart = pageForIterator(prev);
        const prevLength = nodeLength(prev.node);
        const prevPages = numberOfPages(prevLength);

        return prevStart + prevPages;
    } else {
        const parentStart = pageForIterator(bookIter.parent);
        return parentStart;
    }
}

const pageLength = 1500;
export function numberOfPages(length: number): number {
    return Math.ceil(length / pageLength);
}

export function nodeLength(node: ContentNode): number {
    if (isChapter(node)) {
        return node.nodes.reduce((len, n) => len + nodeLength(n), 0);
    } else if (isParagraph(node)) {
        return spanLength(node.span);
    } else {
        return assertNever(node);
    }
}

export function spanLength(span: Span): number {
    if (isSimple(span)) {
        return span.length;
    } else if (isCompound(span)) {
        return span.spans.reduce((l, s) =>
            l + spanLength(s), 0);
    } else if (isAttributed(span)) {
        return spanLength(span.content);
    } else if (isFootnote(span)) {
        return spanLength(span.content);
    } else {
        return assertNever(span);
    }
}

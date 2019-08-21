import {
    ContentNode, isChapter, isParagraph, VolumeNode, Span,
    FootnoteSpan, isFootnote, isCompound, ChapterTitle,
    isSimple, isAttributed, BookNode, hasSubnodes, isImage,
} from 'booka-common';
import { BookPath, BookRange, bookRange } from './bookRange';
import { assertNever, firstDefined } from '../utils';
import {
    iterateToPath, bookIterator, nextIterator, buildPath,
    OptBookIterator, OptParentIterator, nextChapter, iterateUntilCan,
} from './bookIterator';

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

    const next = nextIterator(chapter);

    const range = bookRange(
        buildPath(chapter),
        next && buildPath(next)
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
    if (isParagraph(node) || isImage(node)) {
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

export function nodeLength(node: ContentNode): number {
    if (isChapter(node)) {
        return node.nodes.reduce((len, n) => len + nodeLength(n), 0);
    } else if (isParagraph(node)) {
        return spanLength(node.span);
    } else if (isImage(node)) {
        return 0;
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

export class Pagination {
    constructor(readonly volume: VolumeNode) { }

    public pageForPath(path: BookPath): number {
        return pageForPath(this.volume, path);
    }

    public totalPages(): number {
        return pagesInNodes(this.volume.nodes) + 1;
    }

    public lastPageOfChapter(path: BookPath): number {
        const rootIter = bookIterator(this.volume);
        const pathIter = iterateUntilCan(rootIter, path);
        const nc = nextChapter(pathIter);
        if (nc) {
            const ncPath = buildPath(nc);
            const last = this.pageForPath(ncPath);
            return last;
        } else {
            return this.totalPages();
        }
    }
}

export function pageForPath(node: BookNode, path: BookPath): number {
    if (path.length === 0) {
        return 1;
    }

    if (isParagraph(node) || isImage(node)) {
        // TODO: handle remaining path properly!
        return 1;
    } else if (hasSubnodes(node)) {
        const headPath = path[0];
        const tailPath = path.slice(1);
        const priorNodes = node.nodes.slice(0, headPath);
        const before = pagesInNodes(priorNodes);
        const headNode = node.nodes[headPath];
        if (!headNode) {
            // TODO: handle this unexpected situation
            return before + 1;
        }
        const inside = pageForPath(headNode, tailPath);
        return before + inside;
    } else {
        return assertNever(node);
    }
}

function pagesInNodes(nodes: ContentNode[]): number {
    let result = 0;
    let currentTextLength = 0;
    for (const node of nodes) {
        if (isChapter(node)) {
            result += numberOfPages(currentTextLength);
            currentTextLength = 0;
            result += pagesInNodes(node.nodes);
        } else if (isParagraph(node)) {
            currentTextLength += nodeLength(node);
        }
    }

    result += numberOfPages(currentTextLength);
    return result;
}

const pageLength = 1500;
export function numberOfPages(length: number): number {
    return Math.ceil(length / pageLength);
}

export function spanText(span: Span): string {
    if (isSimple(span)) {
        return span;
    } else if (isAttributed(span)) {
        return spanText(span.content);
    } else if (isCompound(span)) {
        return span.spans
            .map(spanText)
            .join('');
    } else if (isFootnote(span)) {
        return spanText(span.content);
    }

    return assertNever(span);
}

import {
    BookContentNode, VolumeNode,
    ChapterTitle, BookPath, BookRange, pathLessThan,
    nodeTextLength, assertNever,
} from 'booka-common';
import { inRange } from '../utils';
import {
    iterateToPath, bookIterator, buildPath,
    nextChapter, iterateUntilCan,
} from './bookIterator';

export function titleForPath(book: VolumeNode, path: BookPath): ChapterTitle {
    if (path.length === 0) {
        return book.meta.title
            ? [book.meta.title]
            : [];
    }

    const iter = bookIterator(book);
    const node = iterateToPath(iter, path);
    if (node && node.node.node === 'chapter') {
        return node.node.title;
    } else {
        return [];
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

type BookNode = VolumeNode | BookContentNode;
export function pageForPath(node: BookNode, path: BookPath): number {
    if (path.length === 0) {
        return 1;
    }
    switch (node.node) {
        case 'paragraph':
        case 'image-data':
        case 'image-ref':
        case 'list':
        case 'table':
        case 'separator':
            // TODO: handle remaining path properly!
            return 1;
        case 'volume':
        case 'chapter':
        case 'group':
            {
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
            }
        default:
            assertNever(node);
            return 1;
    }
}

function pagesInNodes(nodes: BookContentNode[]): number {
    let result = 0;
    let currentTextLength = 0;
    for (const node of nodes) {
        switch (node.node) {
            case 'chapter':
            case 'group':
                result += numberOfPages(currentTextLength);
                currentTextLength = 0;
                result += pagesInNodes(node.nodes);
                break;
            case 'paragraph':
                currentTextLength += nodeTextLength(node);
                break;
        }
    }

    result += numberOfPages(currentTextLength);
    return result;
}

const pageLength = 1500;
export function numberOfPages(length: number): number {
    return Math.ceil(length / pageLength);
}

export function inBookRange(path: BookPath, range: BookRange): boolean {
    return inRange(path, range, pathLessThan);
}

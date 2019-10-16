import {
    BookNode, BookPath, pathLessThan,
    Book, nodeForPath, iterateNodes,
    extractNodeText, extractBookText, extractSpanText,
} from 'booka-common';

export function titleForPath(book: Book, path: BookPath): string | undefined {
    const node = nodeForPath(book.nodes, path);
    if (node && node.node === 'title') {
        return extractSpanText(node.span);
    } else {
        return undefined;
    }
}

export class Pagination {
    private total: number | undefined;
    constructor(readonly book: Book) { }

    public pageForPath(path: BookPath): number {
        return pageForPath(path, this.book.nodes);
    }

    public totalPages(): number {
        if (this.total !== undefined) {
            return this.total;
        }
        const text = extractBookText(this.book);
        const pages = numberOfPages(text.length);
        this.total = pages;
        return this.total;
    }

    public lastPageOfChapter(path: BookPath): number {
        // TODO: implement
        return this.totalPages();
    }
}

function pageForPath(path: BookPath, nodes: BookNode[]): number {
    let currLength = 0;
    for (const [node, nodePath] of iterateNodes(nodes)) {
        if (pathLessThan(path, nodePath)) {
            break;
        }
        const text = extractNodeText(node);
        currLength += text.length;
    }
    const page = numberOfPages(currLength);
    return page;
}

const pageLength = 1500;
function numberOfPages(length: number): number {
    return Math.ceil(length / pageLength);
}

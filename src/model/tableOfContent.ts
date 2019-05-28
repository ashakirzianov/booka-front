import { BookId } from './bookLocator';
import { assertNever } from '../utils';
import { BookNode, isChapter, isParagraph, BookContent, Span } from './bookContent';
import { isAttributed, isSimple, isFootnote, isCompound } from '../contracts';
import { BookPath } from './bookRange';

export type TableOfContentsItem = {
    title: string,
    level: number,
    path: BookPath,
    pageNumber: number,
};

export type TableOfContents = {
    id: BookId,
    title: string,
    items: TableOfContentsItem[],
};

export function tableOfContents(title: string, id: BookId, items: TableOfContentsItem[]): TableOfContents {
    return { id, title, items };
}

export function tocFromContent(bookContent: BookContent, id: BookId): TableOfContents {
    const items = itemsFromBookNodes(bookContent.nodes, [], 1);

    return tableOfContents(bookContent.meta.title, id, items);
}

function itemsFromBookNode(node: BookNode, path: BookPath, page: number): TableOfContentsItem[] {
    if (isChapter(node)) {
        const head: TableOfContentsItem[] = node.title ? [{
            title: node.title[0],
            level: node.level,
            path: path,
            pageNumber: page,
        }]
            : [];

        const children = itemsFromBookNodes(node.nodes, path, page);
        return head.concat(children);
    } else if (isParagraph(node)) {
        return [];
    } else {
        return assertNever(node);
    }
}

function itemsFromBookNodes(nodes: BookNode[], path: BookPath, page: number): TableOfContentsItem[] {
    let result: TableOfContentsItem[] = [];
    let currPage = page;
    for (let idx = 0; idx < nodes.length; idx++) {
        const bn = nodes[idx];
        const toAdd = itemsFromBookNode(bn, path.concat([idx]), currPage);
        result = result.concat(toAdd);
        const nodeLength = lengthOfNode(bn);
        currPage += numberOfPages(nodeLength);
    }

    return result;
}

const pageLength = 1500;
function numberOfPages(length: number): number {
    return Math.ceil(length / pageLength);
}

function lengthOfNode(node: BookNode): number {
    if (isChapter(node)) {
        return node.nodes.reduce((len, n) => len + lengthOfNode(n), 0);
    } else if (isParagraph(node)) {
        return lengthOfSpan(node.span);
    } else {
        return assertNever(node);
    }
}

function lengthOfSpan(span: Span): number {
    if (isSimple(span)) {
        return span.length;
    } else if (isCompound(span)) {
        return span.spans.reduce((l, s) =>
            l + lengthOfSpan(s), 0);
    } else if (isAttributed(span)) {
        return lengthOfSpan(span.content);
    } else if (isFootnote(span)) {
        return lengthOfSpan(span.content);
    } else {
        return assertNever(span);
    }
}

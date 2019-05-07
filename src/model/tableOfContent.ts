import { BookId } from './bookLocator';
import { assertNever } from '../utils';
import { BookNode, isChapter, isParagraph, BookContent, Span } from './bookContent';
import { isAttributed, isSimple, isFootnote, isCompound } from '../contracts';
import { BookPath } from './bookRange';

export type TableOfContentsItem = {
    toc: 'item',
    title: string,
    level: number,
    path: BookPath,
    id: BookId,
    percentage: number,
};

export type TableOfContents = {
    toc: 'toc',
    title: string,
    items: TableOfContentsItem[],
};

type Info = {
    id: BookId,
    length: number,
};

export function tableOfContents(title: string, items: TableOfContentsItem[]): TableOfContents {
    return {
        toc: 'toc',
        title, items,
    };
}

export function tocFromContent(bookContent: BookContent, id: BookId): TableOfContents {
    const info = {
        id,
        length: lengthOfBook(bookContent),
    };
    const items = itemsFromBookNodes(bookContent.nodes, [], info, 0);

    return tableOfContents(bookContent.meta.title, items);
}

function itemsFromBookNode(node: BookNode, path: BookPath, info: Info, percentage: number): TableOfContentsItem[] {
    if (isChapter(node)) {
        const head: TableOfContentsItem[] = node.title ? [{
            toc: 'item' as 'item',
            title: node.title,
            level: node.level,
            id: info.id,
            path: path,
            percentage: Math.floor(percentage * 1000) / 10,
        }]
            : [];

        const children = itemsFromBookNodes(node.nodes, path, info, percentage);
        return head.concat(children);
    } else if (isParagraph(node)) {
        return [];
    } else {
        return assertNever(node);
    }
}

function itemsFromBookNodes(nodes: BookNode[], path: BookPath, info: Info, percentage: number): TableOfContentsItem[] {
    let result: TableOfContentsItem[] = [];
    let currPercentage = percentage;
    for (let idx = 0; idx < nodes.length; idx++) {
        const bn = nodes[idx];
        const toAdd = itemsFromBookNode(bn, path.concat([idx]), info, currPercentage);
        result = result.concat(toAdd);
        currPercentage += lengthOfNode(bn) / info.length;
    }

    return result;
}

function lengthOfBook(book: BookContent): number {
    return book.nodes.reduce((len, n) => lengthOfNode(n) + len, 0);
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

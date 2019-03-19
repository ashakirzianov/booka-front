import { BookPath, BookId } from './bookLocator';
import { assertNever } from '../utils';
import { BookNode, isChapter, isParagraph, BookContent, isReachParagraph } from './bookContent';

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
    if (bookContent.book === 'book') {
        const info = {
            id,
            length: lengthOfBook(bookContent),
        };
        const items = itemsFromBookNodes(bookContent.content, [], info, 0);

        return tableOfContents(bookContent.meta.title, items);
    }

    return tableOfContents('', []); // TODO: better error handling?
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

        const children = itemsFromBookNodes(node.content, path, info, percentage);
        return head.concat(children);
    } else if (isParagraph(node) || isReachParagraph(node)) {
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
    return book.content.reduce((len, n) => lengthOfNode(n) + len, 0);
}

function lengthOfNode(node: BookNode): number {
    if (isParagraph(node)) {
        return node.length;
    } else if (isReachParagraph(node)) {
        return node.content.reduce((l, s) => l + s.text.length, 0);
    } else if (isChapter(node)) {
        return node.content.reduce((len, n) => len + lengthOfNode(n), 0);
    } else {
        return assertNever(node);
    }
}

import { BookId } from './bookLocator';
import { assertNever } from '../utils';
import { ContentNode, isChapter, isParagraph, VolumeNode } from './bookVolume';
import { BookPath } from './bookRange';
import { nodeLength, numberOfPages } from './book.utils';

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

export function tocFromVolume(volume: VolumeNode, id: BookId): TableOfContents {
    const items = itemsFromBookNodes(volume.nodes, [], 1);

    return tableOfContents(volume.meta.title, id, items);
}

function itemsFromBookNode(node: ContentNode, path: BookPath, page: number): TableOfContentsItem[] {
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

function itemsFromBookNodes(nodes: ContentNode[], path: BookPath, page: number): TableOfContentsItem[] {
    let result: TableOfContentsItem[] = [];
    let currPage = page;
    for (let idx = 0; idx < nodes.length; idx++) {
        const bn = nodes[idx];
        const toAdd = itemsFromBookNode(bn, path.concat([idx]), currPage);
        result = result.concat(toAdd);
        const charLength = nodeLength(bn);
        currPage += numberOfPages(charLength);
    }

    return result;
}

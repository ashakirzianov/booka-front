import { BookId } from './bookLocator';
import { assertNever } from '../utils';
import {
    ContentNode, isChapter, isParagraph, VolumeNode,
    isImage, BookPath,
} from 'booka-common';
import { Pagination } from './book.utils';

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
    const items = itemsFromBookNodes(volume.nodes, [], new Pagination(volume));

    return tableOfContents(volume.meta.title, id, items);
}

function itemsFromBookNode(node: ContentNode, path: BookPath, pagination: Pagination): TableOfContentsItem[] {
    if (isChapter(node)) {
        const head: TableOfContentsItem[] = [{
            title: node.title[0],
            level: node.level,
            path: path,
            pageNumber: pagination.pageForPath(path),
        }];

        const children = itemsFromBookNodes(node.nodes, path, pagination);
        return head.concat(children);
    } else if (isParagraph(node) || isImage(node)) {
        return [];
    } else {
        return assertNever(node);
    }
}

function itemsFromBookNodes(nodes: ContentNode[], path: BookPath, pagination: Pagination): TableOfContentsItem[] {
    let result: TableOfContentsItem[] = [];
    for (let idx = 0; idx < nodes.length; idx++) {
        const bn = nodes[idx];
        const toAdd = itemsFromBookNode(bn, path.concat([idx]), pagination);
        result = result.concat(toAdd);
    }

    return result;
}

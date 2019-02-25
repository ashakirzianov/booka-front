import { BookPath, BookLocator, BookId, bookLocator } from './bookLocator';
import { Book, BookNode, isParagraph, isChapter } from './book';
import { assertNever } from '../utils';

export type TableOfContentsItem = {
    toc: 'item',
    title: string,
    level: number,
    locator: BookLocator,
};

export type TableOfContents = {
    toc: 'toc',
    title: string,
    items: TableOfContentsItem[],
};

export function tableOfContents(title: string, items: TableOfContentsItem[]): TableOfContents {
    return {
        toc: 'toc',
        title, items,
    };
}

export function tocFromBook(book: Book): TableOfContents {
    if (book.book === 'book') {
        const items = book.content
            .map((n, idx) => itemsFromBookNode(n, [idx], book.id))
            .reduce((acc, arr) => acc.concat(arr));

        return tableOfContents(book.meta.title, items);
    }

    return tableOfContents('', []); // TODO: better error handling?
}

function itemsFromBookNode(node: BookNode, path: BookPath, id: BookId): TableOfContentsItem[] {
    if (isChapter(node)) {
        const head: TableOfContentsItem[] = node.title ? [{
            toc: 'item' as 'item',
            title: node.title,
            level: path.length,
            locator: bookLocator(id, path),
        }]
            : [];

        const childrenItems = node.content
            .map((bn, idx) => itemsFromBookNode(bn, path.concat([idx]), id))
            .reduce((acc, arr) => acc.concat(arr));

        return head.concat(childrenItems);
    } else if (isParagraph(node)) {
        return [];
    } else {
        return assertNever(node);
    }
}

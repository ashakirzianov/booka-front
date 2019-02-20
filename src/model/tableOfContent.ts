import { BookPath } from './bookLocator';

export type TableOfContentItem = {
    toc: 'item',
    title: string,
    level: number,
    path: BookPath,
};

export type TableOfContent = {
    toc: 'toc',
    title: string,
    items: TableOfContentItem[],
};

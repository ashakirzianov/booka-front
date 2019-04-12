import { BookId } from './bookLocator';
import { BookContent } from './bookContent';
import { TableOfContents } from './tableOfContent';

export type Book = {
    id: BookId,
    toc: TableOfContents,
    content: BookContent,
};

import { Book } from 'booka-common';
import { BookId } from './bookLocator';
import { TableOfContents } from './tableOfContent';

export type BookObject = {
    id: BookId,
    toc: TableOfContents,
    book: Book,
};

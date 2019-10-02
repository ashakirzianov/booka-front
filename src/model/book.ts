import { Book, TableOfContents } from 'booka-common';
import { BookId } from './bookLocator';

export type BookObject = {
    id: BookId,
    toc: TableOfContents,
    book: Book,
};

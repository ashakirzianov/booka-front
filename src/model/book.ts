import { BookId } from './bookLocator';
import { VolumeNode } from './bookVolume';
import { TableOfContents } from './tableOfContent';

export type Book = {
    id: BookId,
    toc: TableOfContents,
    volume: VolumeNode,
};

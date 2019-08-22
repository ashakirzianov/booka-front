import { VolumeNode, IdDictionary } from 'booka-common';
import { BookId } from './bookLocator';
import { TableOfContents } from './tableOfContent';

export type Book = {
    id: BookId,
    toc: TableOfContents,
    volume: VolumeNode,
    idDictionary: IdDictionary,
};

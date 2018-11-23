import * as React from 'react';
import { Library, BookMeta } from 'src/model';
import { Comp } from './comp-utils';
import { Column, Row } from './Elements';
import { loadable } from './higherLevel';

const BookMetaComp: Comp<BookMeta> = props =>
    <Row>
        <Row>{props.title}</Row>
    </Row>;

export const LibraryComp = loadable<Library>(props =>
    <Column>
        { props.bookMetas.map(bm => <BookMetaComp key={bm.id} {...bm} /> ) }
    </Column>
);
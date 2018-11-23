import * as React from 'react';
import { Library, BookMeta } from 'src/model';
import { Comp } from './comp-utils';
import { Column, Row, TextBlock } from './Elements';
import { loadable } from './higherLevel';

const BookMetaComp: Comp<BookMeta> = props =>
    <Row>
        <TextBlock text={props.title} />
    </Row>;

export const LibraryComp = loadable<Library>(props =>
    <Column>
        { props.bookMetas.map(bm => <BookMetaComp key={bm.id} {...bm} /> ) }
    </Column>
);
import * as React from 'react';
import { Library, BookMeta } from 'src/model';
import { Comp } from './comp-utils';
import { Column, Row, LinkButton, loadable } from './Elements';

const BookMetaComp: Comp<{ meta: BookMeta, id: string }> = props =>
    <Row>
        <LinkButton text={props.meta.title} to={'/book/' + props.id} />
    </Row>;

export const LibraryComp = loadable<Library>(props =>
    <Column>
        {
            Object.keys(props).map(
                id => <BookMetaComp key={id} meta={props[id]!} id={id} /> )
        }
    </Column>
);
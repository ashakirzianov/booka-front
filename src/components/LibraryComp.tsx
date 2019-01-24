import * as React from 'react';
import { Library, BookMeta } from '../model';
import { Comp } from './comp-utils';
import { Column, Row, LinkButton, loadable, TextBlock } from './Elements';

const BookMetaComp: Comp<{ meta: BookMeta, id: string }> = props =>
    <Row>
        <LinkButton text={props.meta.title} to={'/book/' + props.id} />
    </Row>;

export const LibraryComp = loadable<Library>(props =>
    <Column>
    <TextBlock text='Hello' />
        {
            Object.keys(props).map(
                id => <BookMetaComp key={id} meta={props[id]!} id={id} /> )
        }
    </Column>
);
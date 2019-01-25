import * as React from 'react';
import { Library, BookMeta } from '../model';
import { Comp } from './comp-utils';
import { Column, Row, LinkButton, loadable } from './Elements';
import { connect } from './misc';

const BookMetaComp: Comp<{ meta: BookMeta, id: string }> = props =>
    <Row>
        <LinkButton text={props.meta.title} to={'/book/' + props.id} />
    </Row>;

const LibraryComp = loadable<Library>(props =>
    <Column>
        {
            Object.keys(props).map(
                id => <BookMetaComp key={id} meta={props[id]!} id={id} /> )
        }
    </Column>
);

export const CurrentLibraryComp = connect(['library'])(
    props => <LibraryComp {...props.library} />
);

import * as React from 'react';
import { Library, BookMeta, Book, staticBookLocator, isLoading } from '../model';
import { Comp } from './comp-utils';
import { Column, Row, LinkButton, LoadingComp } from './Elements';
import { connect } from './misc';
import { fetchBL } from '../api';

const BookMetaComp: Comp<{ meta: BookMeta, id: string }, { openBook: Promise<Book> }> = props =>
    <Row>
        <LinkButton
            text={props.meta.title}
            onClick={
                () => props.openBook && props.openBook(fetchBL(staticBookLocator(props.id)))
            }
        />
    </Row>;

const LibraryComp: Comp<Library, { openBook: Promise<Book> }> = (props =>
    <Column>
        {
            Object.keys(props).map(
                id => <BookMetaComp
                    key={id} meta={props[id]!} id={id}
                    openBook={book => {
                        props.openBook && props.openBook(book);
                    }}
                    /> )
        }
    </Column>
);

export const ConnectedLibraryComp = connect(['library'], ['setBook'])(
    props => isLoading(props.library)
        ? <LoadingComp {...props.library} />
        : <LibraryComp
            openBook={props.setBook as any} // TODO: !! fix this
            {...props.library}
            />
);

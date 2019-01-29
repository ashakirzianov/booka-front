import * as React from 'react';
import { Library, BookMeta, Book, staticBookLocator, isLoading, BookLocator } from '../model';
import { Comp } from './comp-utils';
import { Column, Row, LinkButton, LoadingComp } from './Elements';
import { connect } from './misc';
import api from '../api';
import { PromisePlus } from '../utils';

const BookMetaComp: Comp<{ meta: BookMeta, id: string }, { openBook: PromisePlus<Book, BookLocator> }> = props =>
    <Row>
        <LinkButton
            text={props.meta.title}
            onClick={
                () => props.openBook && props.openBook(api.bookForLocator(staticBookLocator(props.id)))
            }
        />
    </Row>;

const LibraryComp: Comp<Library, { openBook: PromisePlus<Book, BookLocator> }> = (props =>
    <Column>
        {
            Object.keys(props.books).map(
                id => <BookMetaComp
                    key={id} meta={props.books[id]!} id={id}
                    openBook={props.openBook}
                    /> )
        }
    </Column>
);

export const ConnectedLibraryComp = connect(['library'], ['setCurrentBook', 'navigateToBookScreen'])(
    props => isLoading(props.library)
        ? <LoadingComp {...props.library} />
        : <LibraryComp
            {...props.library}
            openBook={book => {
                props.setCurrentBook(book);
                props.navigateToBookScreen();
            }}
            />
);

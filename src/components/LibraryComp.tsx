import * as React from 'react';
import { Library, BookMeta, Book, staticBookLocator } from '../model';
import { Comp } from './comp-utils';
import { Column, Row, LinkButton, ActivityIndicator } from './Elements';
import api from '../api';
import { OptimisticPromise } from '../promisePlus';
import { connect } from './higherLevel';

const BookMetaComp: Comp<{ meta: BookMeta, id: string }, { openBook: OptimisticPromise<Book> }> = props =>
    <Row>
        <LinkButton
            text={props.meta.title}
            onClick={
                () => props.openBook && props.openBook(api.bookForLocator(staticBookLocator(props.id)))
            }
        />
    </Row>;

const LibraryComp: Comp<Library, { openBook: OptimisticPromise<Book> }> = (props =>
    <Column>
        {
            props.loading ? <ActivityIndicator />
                : Object.keys(props.books).map(
                    id => <BookMetaComp
                        key={id} meta={props.books[id]!} id={id}
                        openBook={props.openBook}
                    />)
        }
    </Column>
);

export const ConnectedLibraryComp = connect(['library'], ['setCurrentBook', 'navigateToBookScreen'])(
    props =>
        <LibraryComp
            {...props.library}
            openBook={book => {
                props.setCurrentBook(book);
                props.navigateToBookScreen();
            }}
        />
);

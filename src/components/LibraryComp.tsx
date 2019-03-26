import * as React from 'react';

import { Library, BookInfo, bookLocator, remoteBookId } from '../model';
import { linkForBook } from '../logic/routing';
import { Comp, Row, Link, SafeAreaView, Column, ActivityIndicator, Text } from '../blocks';

const BookMetaComp: Comp<{ meta: BookInfo, id: string }> = (props =>
    <Row>
        <Link to={linkForBook(bookLocator(remoteBookId(props.id)))}>
            <Text>{props.meta.title}</Text>
        </Link>
    </Row>
);

export const LibraryComp: Comp<Library> = (props =>
    <SafeAreaView>
        <Column>
            {
                props.loading ? <ActivityIndicator />
                    : Object.keys(props.books).map(
                        id => <BookMetaComp
                            key={id} meta={props.books[id]!} id={id}
                        />)
            }
        </Column>
    </SafeAreaView>
);

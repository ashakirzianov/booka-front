import * as React from 'react';

import { Library, BookInfo, bookLocator, remoteBookId } from '../model';
import { linkForBook } from '../logic/routing';
import { comp, Row, Link, SafeAreaView, Column, ActivityIndicator, ThemedText } from '../blocks';

const BookMetaComp = comp<{ meta: BookInfo, id: string }>(props =>
    <Row>
        <Link to={linkForBook(bookLocator(remoteBookId(props.id)))}>
            <ThemedText>{props.meta.title}</ThemedText>
        </Link>
    </Row>,
);

export const LibraryComp = comp<Library>(props =>
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
    </SafeAreaView>,
);

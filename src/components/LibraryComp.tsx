import * as React from 'react';

import { Library, BookInfo, bookLocator, remoteBookId } from '../model';
import { linkForBook } from '../logic/routing';
import { Comp, Row, LinkButton, SafeAreaView, Column, ActivityIndicator } from '../blocks';

const BookMetaComp: Comp<{ meta: BookInfo, id: string }> = (props =>
    <Row>
        <LinkButton
            text={props.meta.title}
            link={linkForBook(bookLocator(remoteBookId(props.id)))}
        />
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

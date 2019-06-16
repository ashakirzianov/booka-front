import * as React from 'react';

import { Library, BookInfo, remoteBookId, locationCurrent, bookLocator } from '../model';
import { Comp, Row, TextLink, SafeAreaView, Column, ThemedText, relative } from '../blocks';
import { actionCreators } from '../redux';

const BookMetaComp: Comp<{ meta: BookInfo, id: string }> = (props =>
    <Row>
        <TextLink
            style={{ margin: relative(0.5) }}
            action={actionCreators.navigateToBook(
                bookLocator(remoteBookId(props.id), locationCurrent()))}
        >
            <ThemedText>{props.meta.title}</ThemedText>
        </TextLink>
    </Row>
);

export const LibraryComp: Comp<Library> = (props =>
    <SafeAreaView>
        <Column>
            {
                Object.keys(props.books).map(
                    id => <BookMetaComp
                        key={id} meta={props.books[id]!} id={id}
                    />)
            }
        </Column>
    </SafeAreaView>
);

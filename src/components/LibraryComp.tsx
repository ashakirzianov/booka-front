import * as React from 'react';

import { Library, BookInfo, remoteBookId, locationCurrent, bookLocator } from '../model';
import { Comp, Row, SafeAreaView, Column, ThemedText, relative, ActionLink, Hoverable } from '../blocks';
import { actionCreators } from '../core';

const BookMetaComp: Comp<{ meta: BookInfo, id: string }> = (props =>
    <Row>
        <ActionLink
            style={{ margin: relative(0.5) }}
            action={actionCreators.navigateToBook(
                bookLocator(remoteBookId(props.id), locationCurrent()))}
        >
            <Hoverable>
                <ThemedText>{props.meta.title}</ThemedText>
            </Hoverable>
        </ActionLink>
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

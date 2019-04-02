import * as React from 'react';

import { Library, BookInfo, remoteBookId } from '../model';
import { linkForCurrentPosition } from '../logic/routing';
import { comp, Row, Link, SafeAreaView, Column, ThemedText } from '../blocks';

const BookMetaComp = comp<{ meta: BookInfo, id: string }>(props =>
    <Row>
        <Link to={linkForCurrentPosition(remoteBookId(props.id))}>
            <ThemedText>{props.meta.title}</ThemedText>
        </Link>
    </Row>,
);

export const LibraryComp = comp<Library>(props =>
    <SafeAreaView>
        <Column>
            {
                Object.keys(props.books).map(
                    id => <BookMetaComp
                        key={id} meta={props.books[id]!} id={id}
                    />)
            }
        </Column>
    </SafeAreaView>,
);

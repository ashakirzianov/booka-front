import * as React from 'react';
import { Library, BookMeta, BookLocator, remoteBookLocator } from '../model';
import { Comp } from './comp-utils';
import { Column, Row, LinkButton, ActivityIndicator } from './Elements';
import { SafeAreaView } from './Atoms';

const BookMetaComp: Comp<{ meta: BookMeta, id: string }, { openBook: BookLocator }> = (props =>
    <Row>
        <LinkButton
            text={props.meta.title}
            onClick={
                () => props.openBook && props.openBook(remoteBookLocator(props.id))
            }
        />
    </Row>
);

export const LibraryComp: Comp<Library, { openBook: BookLocator }> = (props =>
    <SafeAreaView>
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
    </SafeAreaView>
);

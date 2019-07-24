import * as React from 'react';

import { Library, BookInfo, remoteBookId, locationCurrent, bookLocator } from '../model';
import {
    Row, SafeAreaView, Column, EmptyLine,
} from '../blocks';
import { actionCreators } from '../core';
import { TextButton } from './Connected';

type BookItemProps = {
    meta: BookInfo,
    id: string,
};
function BookItem({ meta, id }: BookItemProps) {
    return <Row>
        <TextButton
            color='text'
            text={meta.title}
            action={actionCreators.navigateToBook(
                bookLocator(remoteBookId(id), locationCurrent()))}
        />
    </Row>;
}

export type LibraryProps = {
    library: Library,
};
export function LibraryComp({ library }: LibraryProps) {
    return <SafeAreaView>
        <Column>
            <EmptyLine />
            {
                Object.keys(library.books).map(
                    id =>
                        <BookItem
                            key={id}
                            meta={library.books[id]!}
                            id={id}
                        />
                )
            }
            <EmptyLine />
        </Column>
    </SafeAreaView>;
}

import * as React from 'react';

import { Library, BookInfo, remoteBookId, locationCurrent, bookLocator } from '../model';
import {
    Comp, Row, SafeAreaView, Column, TextButton,
} from '../blocks';
import { actionCreators } from '../core';

type BookItemProps = {
    meta: BookInfo,
    id: string,
};
function BookItem({ meta, id }: BookItemProps) {
    return <Row>
        <TextButton
            text={meta.title}
            action={actionCreators.navigateToBook(
                bookLocator(remoteBookId(id), locationCurrent()))}
        />
    </Row>;
}

export const LibraryComp: Comp<Library> = (props =>
    <SafeAreaView>
        <Column>
            {
                Object.keys(props.books).map(
                    id =>
                        <BookItem
                            key={id}
                            meta={props.books[id]!}
                            id={id}
                        />
                )
            }
        </Column>
    </SafeAreaView>
);

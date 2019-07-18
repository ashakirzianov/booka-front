import * as React from 'react';

import { Library, BookInfo, remoteBookId, locationCurrent, bookLocator } from '../model';
import {
    Comp, Row, SafeAreaView, Column, TextLine,
    ActionLink, point,
} from '../blocks';
import { actionCreators } from '../core';

type BookItemProps = {
    meta: BookInfo,
    id: string,
};
function BookItem({ meta, id }: BookItemProps) {
    return <Row>
        <ActionLink
            style={{ margin: point(0.5) }}
            action={actionCreators.navigateToBook(
                bookLocator(remoteBookId(id), locationCurrent()))}
        >
            <TextLine
                text={meta.title}
                hoverColor='accent'
            />
        </ActionLink>
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

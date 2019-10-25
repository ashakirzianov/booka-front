import * as React from 'react';

import {
    Library, BookDesc, remoteBookId, locationCurrent, bookLocator, HasTheme,
} from '../model';
import {
    SafeAreaView, Column, EmptyLine, TextButton,
} from '../blocks';
import { actionCreators } from '../core';
import { dispatch } from '../core/store';

type BookItemProps = HasTheme & {
    meta: BookDesc,
    id: string,
};
function BookItem({ meta, id, theme }: BookItemProps) {
    return <Column>
        <TextButton
            theme={theme}
            color='text'
            text={meta.title}
            onClick={() => {
                dispatch(actionCreators.navigateToBook(
                    bookLocator(remoteBookId(id), locationCurrent())
                ));
            }}
        />
    </Column>;
}

export type LibraryProps = HasTheme & {
    library: Library,
};
export function LibraryComp({ library, theme }: LibraryProps) {
    return <SafeAreaView>
        <Column>
            <EmptyLine />
            {
                Object.keys(library.books).map(
                    id =>
                        <BookItem
                            theme={theme}
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

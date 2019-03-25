import * as React from 'react';

import { comp, ActivityIndicator, connected, Comp, Label } from '../blocks';
import {
    Book, ErrorBook, LoadedBook, BookPath,
    inRange, bookRange, emptyPath,
} from '../model';
import { assertNever } from '../utils';
import { TableOfContents } from '../model/tableOfContent';
import { BookContentComp } from './BookContentComp';

export const BookComp = comp<Book>(props => {
    switch (props.book) {
        case 'error':
            return <ErrorBookComp {...props} />;
        case 'book':
            return <LoadedBookComp {...props} />;
        case 'loading':
            return <ActivityIndicator />;
        default:
            return assertNever(props);
    }
});

const LoadedBookComp = connected(['pathToOpen'], ['updateCurrentBookPosition'])<LoadedBook>(props => {
    const {
        pathToOpen, updateCurrentBookPosition,
        content, id, toc,
    } = props;
    const { prev, current, next } = buildPaths(pathToOpen || emptyPath(), toc);
    return <BookContentComp
        pathToNavigate={pathToOpen}
        updateCurrentBookPosition={updateCurrentBookPosition}
        range={bookRange(current, next)}
        prevPath={prev}
        nextPath={next}
        content={content}
        id={id}
    />;
});

const ErrorBookComp: Comp<ErrorBook> = props =>
    <Label text={'Error: ' + props.error} />;

function buildPaths(path: BookPath, toc: TableOfContents): {
    prev?: BookPath,
    current: BookPath,
    next?: BookPath,
} {
    let current = emptyPath();
    let prev: BookPath | undefined;
    let skipFirst = false;

    for (const item of toc.items.filter(i => i.level === 0)) {
        if (skipFirst) {
            const next = item.path;

            if (inRange(path, bookRange(current, next))) {
                return { prev, current, next };
            }

            prev = current;
            current = next;
        }
        skipFirst = true;
    }

    return { prev, current };
}

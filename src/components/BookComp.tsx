import * as React from 'react';

import { comp, ActivityIndicator, connect, Label } from '../blocks';
import {
    Book, ErrorBook, LoadedBook, BookPath,
    inRange, bookRange, emptyPath, isFirstSubpath,
} from '../model';
import { assertNever } from '../utils';
import { TableOfContents, TableOfContentsItem } from '../model/tableOfContent';
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

const LoadedBookComp = connect(['pathToOpen'], ['updateBookPosition'])<LoadedBook>(props => {
    const {
        pathToOpen, updateBookPosition,
        content, id, toc,
    } = props;
    const { prev, current, next } = buildPaths(pathToOpen || emptyPath(), toc);
    return <BookContentComp
        pathToNavigate={pathToOpen}
        updateBookPosition={updateBookPosition}
        range={bookRange(current, next)}
        prevPath={prev}
        nextPath={next}
        content={content}
        id={id}
    />;
});

const ErrorBookComp = comp<ErrorBook>(props =>
    <Label text={'Error: ' + props.error} />,
);

function buildPaths(path: BookPath, toc: TableOfContents): {
    prev?: BookPath,
    current: BookPath,
    next?: BookPath,
} {
    function tocItemCondition(item: TableOfContentsItem): boolean {
        return true;
    }

    let current = emptyPath();
    let prev: BookPath | undefined;

    for (let idx = 1; idx < toc.items.length; idx++) {
        const item = toc.items[idx];
        if (tocItemCondition(item)) {
            let next = item.path;

            // If next chapter is directly bellow current chapter
            // (e.g. no paragraphs between) we merge them together
            while (isFirstSubpath(current, next)) {
                idx++;
                const candidate = toc.items[idx];
                if (!candidate) {
                    break;
                }
                if (tocItemCondition(candidate)) {
                    next = candidate.path;
                }
            }

            if (inRange(path, bookRange(current, next))) {
                return { prev, current, next };
            }

            prev = current;
            current = next;
        }
    }

    return { prev, current };
}

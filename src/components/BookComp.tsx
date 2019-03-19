import * as React from 'react';
import {
    Book, ErrorBook, LoadedBook, isChapter, BookPath, BookRange, inRange, bookRange, BookContent,
    iterateToPath, bookIterator, OptBookIterator, nextIterator, buildPath, emptyPath,
} from '../model';
import { assertNever } from '../utils';
import { Comp, connected, comp } from './comp-utils';
import {
    ActivityIndicator, Label,
} from './Elements';
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

const LoadedBookComp = connected(['positionToNavigate'], ['updateCurrentBookPosition'])<LoadedBook>(props => {
    const {
        positionToNavigate, updateCurrentBookPosition,
        content, id, toc,
    } = props;
    const { prev, current, next } = buildPaths(positionToNavigate || emptyPath(), toc);
    return <BookContentComp
        pathToNavigate={positionToNavigate}
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

export function computeRangeForPath(book: BookContent, path: BookPath): BookRange {
    const iterator = iterateToPath(bookIterator(book), path);
    const chapter = findChapterLevel(iterator);

    const nextChapter = nextIterator(chapter);

    const range = bookRange(
        buildPath(chapter),
        nextChapter && buildPath(nextChapter),
    );

    return range;
}

function findChapterLevel(i: OptBookIterator): OptBookIterator {
    if (!i) {
        return undefined;
    }
    if (isChapter(i.node) && i.node.level === 0) {
        return i;
    } else {
        return findChapterLevel(i.parent());
    }
}

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

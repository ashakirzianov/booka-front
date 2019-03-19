import * as React from 'react';
import {
    Book, ErrorBook, isChapter, BookPath, BookRange, inRange, bookRange, BookContent,
    iterateToPath, bookIterator, OptBookIterator, nextIterator, buildPath, emptyPath,
} from '../model';
import { assertNever } from '../utils';
import { Comp, connected } from './comp-utils';
import {
    ActivityIndicator, Label,
} from './Elements';
import { TableOfContents } from '../model/tableOfContent';
import { BookContentComp } from './BookContentComp';

export const BookComp = connected(['positionToNavigate'], ['updateCurrentBookPosition'])<Book>(props => {
    switch (props.book) {
        case 'error':
            return <ErrorBookComp {...props} />;
        case 'book':
            const position = props.positionToNavigate || emptyPath();
            const paths = buildPaths(position, props.toc);
            return <BookContentComp
                pathToNavigate={props.positionToNavigate}
                updateCurrentBookPosition={props.updateCurrentBookPosition}
                range={bookRange(paths.current, paths.next)}
                prevPath={paths.prev}
                nextPath={paths.next}
                {...props} />;
        case 'loading':
            return <ActivityIndicator />;
        default:
            return assertNever(props);
    }
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

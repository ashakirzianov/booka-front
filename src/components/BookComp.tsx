import * as React from 'react';

import { connect } from '../blocks';
import {
    Book, BookPath,
    inRange, bookRange, emptyPath, isFirstSubpath, BookRange,
} from '../model';
import { TableOfContents, TableOfContentsItem } from '../model';
import { Reader } from './Reader';

export type BookProps = Book & {
    quoteRange: BookRange | undefined,
};
export const BookComp = connect(['pathToOpen'], ['updateBookPosition', 'toggleControls'])<BookProps>(props => {
    const {
        pathToOpen, updateBookPosition, toggleControls,
        volume, id, toc,
    } = props;
    const { prev, current, next } = buildPaths(pathToOpen || emptyPath(), toc);
    return <Reader
        pathToNavigate={pathToOpen}
        updateBookPosition={updateBookPosition}
        toggleControls={toggleControls}
        range={bookRange(current, next)}
        quoteRange={props.quoteRange}
        prevPath={prev}
        nextPath={next}
        volume={volume}
        id={id}
    />;
});

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

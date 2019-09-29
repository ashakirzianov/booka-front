import * as React from 'react';

import {
    BookPath, BookRange, Callback,
    bookRange, isFirstSubpath, emptyPath, nodesForPath,
    rangeRelativeToPath,
} from 'booka-common';
import {
    BookId, bookLocator, locationPath, titleForPath, BookObject,
    TableOfContentsItem, TableOfContents, inBookRange, colors,
    Theme, fontSize, highlights,
} from '../model';
import {
    Row, Column, point,
    Scroll, Clickable, EmptyLine, useCopy,
} from '../blocks';
import { actionCreators, generateQuoteLink } from '../core';
import { BorderButton, connect } from './Connected';
import { BookFragmentComp, BookSelection } from '../reader';

export type ReaderProps = {
    theme: Theme,
    book: BookObject,
    pathToOpen: BookPath | null,
    quoteRange: BookRange | undefined,
    updateBookPosition: Callback<BookPath>,
    toggleControls: Callback<void>,
    openFootnote: Callback<string>,
};
function ReaderC({
    pathToOpen, updateBookPosition,
    book: { id, volume, toc },
    toggleControls,
    theme,
    openFootnote,
    quoteRange,
}: ReaderProps) {
    const { prevPath, currentPath, nextPath } = buildPaths(pathToOpen || emptyPath(), toc);

    const firstNodePath = currentPath.concat(0);
    const nodes = nodesForPath(volume.nodes, firstNodePath) || [];

    const prevTitle = prevPath && titleForPath(volume, prevPath)[0];
    const nextTitle = nextPath && titleForPath(volume, nextPath)[0];

    const selection = React.useRef<BookSelection | undefined>(undefined);
    const selectionHandler = React.useCallback((sel: BookSelection | undefined) => {
        if (sel) {
            const start = [...firstNodePath, ...sel.range.start];
            const end = [...firstNodePath, ...sel.range.end];
            selection.current = {
                text: sel.text,
                range: { start, end },
            };
        } else {
            selection.current = sel;
        }
    }, [firstNodePath]);
    useCopy(React.useCallback((e: ClipboardEvent) => {
        if (selection.current && e.clipboardData) {
            e.preventDefault();
            const selectionText = `${selection.current.text}\n${generateQuoteLink(id, selection.current.range)}`;
            e.clipboardData.setData('text/plain', selectionText);
        }
    }, [id]));

    const scrollHandler = React.useCallback((path: number[]) => {
        const actualPath = [...firstNodePath, ...path];
        updateBookPosition(actualPath);
    }, [updateBookPosition, firstNodePath]);

    const pathToScroll = (pathToOpen && pathToOpen.slice(firstNodePath.length)) || undefined;

    const relativeQuoteRange = quoteRange && rangeRelativeToPath(quoteRange, firstNodePath);
    const colorization = relativeQuoteRange
        ? [{
            color: highlights(theme).quote,
            range: relativeQuoteRange,
        }]
        : undefined;

    return <Scroll>
        <Row fullWidth centered>
            <Column maxWidth={point(50)} fullWidth padding={point(1)} centered>
                <EmptyLine />
                <PathLink path={prevPath} id={id} text={prevTitle || 'Previous'} />
                <Clickable onClick={toggleControls}>
                    <Column>
                        <BookFragmentComp
                            fragment={{
                                nodes,
                                curr: firstNodePath,
                            }}
                            colorization={colorization}
                            color={colors(theme).text}
                            refColor={colors(theme).accent}
                            refHoverColor={colors(theme).highlight}
                            fontFamily={theme.fontFamilies.book}
                            fontSize={fontSize(theme, 'text')}
                            onScroll={scrollHandler}
                            pathToScroll={pathToScroll}
                            onSelectionChange={selectionHandler}
                            onRefClick={openFootnote}
                        />
                    </Column>
                </Clickable>
                <PathLink path={nextPath} id={id} text={nextTitle || 'Next'} />
                <EmptyLine />
            </Column>
        </Row>
    </Scroll>;
}
export const Reader = connect(['pathToOpen', 'theme'], ['updateBookPosition', 'toggleControls', 'openFootnote'])(ReaderC);

type PathLinkProps = {
    path: BookPath | undefined,
    id: BookId,
    text: string,
};
function PathLink(props: PathLinkProps) {
    return props.path === undefined ? null :
        <Row centered margin={point(1)}>
            <BorderButton
                action={actionCreators
                    .navigateToBook(bookLocator(props.id, locationPath(props.path)))}
                text={props.text}
                fontFamily='book'
            />
        </Row>;
}

function buildPaths(path: BookPath, toc: TableOfContents): {
    prevPath?: BookPath,
    currentPath: BookPath,
    nextPath?: BookPath,
} {
    function tocItemCondition(item: TableOfContentsItem): boolean {
        return true;
    }

    let currentPath = emptyPath();
    let prevPath: BookPath | undefined;

    for (let idx = 1; idx < toc.items.length; idx++) {
        const item = toc.items[idx];
        if (tocItemCondition(item)) {
            let nextPath = item.path;

            // If next chapter is directly bellow current chapter
            // (e.g. no paragraphs between) we merge them together
            while (isFirstSubpath(currentPath, nextPath)) {
                idx++;
                const candidate = toc.items[idx];
                if (!candidate) {
                    break;
                }
                if (tocItemCondition(candidate)) {
                    nextPath = candidate.path;
                }
            }

            if (inBookRange(path, bookRange(currentPath, nextPath))) {
                return { prevPath, currentPath, nextPath };
            }

            prevPath = currentPath;
            currentPath = nextPath;
        }
    }

    return { prevPath, currentPath };
}

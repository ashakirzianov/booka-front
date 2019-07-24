import * as React from 'react';

import {
    BookPath, BookId, bookLocator, BookRange, ContentNode,
    bookRange, locationPath, parentPath, titleForPath, Book,
    isFirstSubpath, inBookRange, emptyPath,
    TableOfContentsItem, TableOfContents,
} from '../model';
import {
    Callback, Row, RefType,
    isPartiallyVisible, scrollToRef, Column, point,
    Scroll, Clickable, EmptyLine, useCopy, useSelection,
    connect,
} from '../blocks';
import { actionCreators, generateQuoteLink } from '../core';
import { getSelectionRange, BookSelection } from './platform';
import { buildNodes, buildBook, Params } from './bookRender';
import { pathToString, parsePath } from './common';
import { BorderButton } from './Connected';

type RefMap = { [k in string]?: RefType };
export type ReaderProps = {
    book: Book,
    pathToOpen: BookPath | null,
    updateBookPosition: Callback<BookPath>,
    toggleControls: Callback<void>,
    quoteRange: BookRange | undefined,
};
function ReaderC(props: ReaderProps) {
    const {
        quoteRange, pathToOpen,
        book: { id, volume, toc },
        updateBookPosition, toggleControls,
    } = props;
    const { prevPath, currentPath, nextPath } = buildPaths(pathToOpen || emptyPath(), toc);

    const range = bookRange(currentPath, nextPath);

    const refMap = React.useRef<RefMap>({});
    const selectedRange = React.useRef<BookSelection | undefined>(undefined);

    React.useEffect(function scrollToCurrentPath() {
        if (pathToOpen) {
            const refToNavigate =
                refMap.current[pathToString(pathToOpen)]
                // TODO: find better solution
                // In case we navigate to character
                || refMap.current[pathToString(parentPath(pathToOpen))]
                ;
            scrollToRef(refToNavigate);
            // if (!scrollToRef(refToNavigate)) {
            //     setTimeout(scrollToCurrentPath, 250);
            // }
        }
    }, [pathToOpen]);

    useSelection(function handleSelection() {
        selectedRange.current = getSelectionRange();
    });

    useCopy(function handleCopy(e: ClipboardEvent) {
        if (selectedRange.current && e.clipboardData) {
            e.preventDefault();
            const selectionText = composeSelection(selectedRange.current, id);
            e.clipboardData.setData('text/plain', selectionText);
        }
    });

    const prevTitle = prevPath && titleForPath(volume, prevPath)[0];
    const nextTitle = nextPath && titleForPath(volume, nextPath)[0];
    const params: Params = {
        pageRange: range,
        refPathHandler: (ref, path) => {
            refMap.current[pathToString(path)] = ref;
        },
        quoteRange: quoteRange,
    };

    return <Scroll
        // TODO: use 'useCallback' ?
        onScroll={async () => {
            const newCurrentPath = await computeCurrentPath(refMap.current);
            if (newCurrentPath) {
                updateBookPosition(newCurrentPath);
            }
        }}
    >
        <Row maxWidth={point(50)} fullWidth centered>
            <Column fullWidth padding={point(1)} centered>
                <EmptyLine />
                <PathLink path={prevPath} id={id} text={prevTitle || 'Previous'} />
                <Clickable onClick={toggleControls}>
                    <Column>
                        {buildBook(volume, params)}
                    </Column>
                </Clickable>
                <PathLink path={nextPath} id={id} text={nextTitle || 'Next'} />
                <EmptyLine />
            </Column>
        </Row>
    </Scroll>;
}
export const Reader = connect(['pathToOpen'], ['updateBookPosition', 'toggleControls'])(ReaderC);

export type BookNodesProps = {
    nodes: ContentNode[],
};
export function BookNodesComp(props: BookNodesProps) {
    return <>
        {
            buildNodes(props.nodes, [], {
                refPathHandler: () => undefined,
                pageRange: bookRange(),
            })
        }
    </>;
}

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
                family='book'
            />
        </Row>;
}

function composeSelection(selection: BookSelection, id: BookId) {
    return `${selection.text}\n${generateQuoteLink(id, selection.range)}`;
}

async function computeCurrentPath(refMap: RefMap) {
    for (const [key, ref] of Object.entries(refMap)) {
        const isVisible = await isPartiallyVisible(ref);
        if (isVisible) {
            const path = parsePath(key);
            if (path) {
                return path;
            }
        }
    }

    return undefined;
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

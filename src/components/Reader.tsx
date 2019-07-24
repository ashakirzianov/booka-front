import * as React from 'react';
import {
    BookPath, BookId, bookLocator, BookRange, ContentNode,
    VolumeNode, bookRange, locationPath, parentPath, titleForPath,
} from '../model';
import {
    Comp, Callback, Row, RefType,
    isPartiallyVisible, scrollToRef, Column, point,
    Scroll, Clickable, EmptyLine, useCopy, useSelection,
} from '../blocks';
import { actionCreators, generateQuoteLink } from '../core';
import {
    getSelectionRange, BookSelection,
} from './Reader.plat';
import { buildNodes, buildBook, Params } from './bookRender';
import { pathToString, parsePath } from './common';
import { BorderButton } from './Connected';

type RefMap = { [k in string]?: RefType };
export type ReaderProps = {
    volume: VolumeNode,
    pathToNavigate: BookPath | null,
    updateBookPosition: Callback<BookPath>,
    toggleControls: Callback<void>,
    range: BookRange,
    prevPath?: BookPath,
    nextPath?: BookPath,
    quoteRange: BookRange | undefined,
    id: BookId,
};

export function Reader(props: ReaderProps) {
    const {
        quoteRange, range,
        prevPath, nextPath, pathToNavigate,
        id, volume,
        updateBookPosition, toggleControls,
    } = props;

    const refMap = React.useRef<RefMap>({});
    const selectedRange = React.useRef<BookSelection | undefined>(undefined);

    React.useEffect(function scrollToCurrentPath() {
        if (pathToNavigate) {
            const refToNavigate =
                refMap.current[pathToString(pathToNavigate)]
                // TODO: find better solution
                // In case we navigate to character
                || refMap.current[pathToString(parentPath(pathToNavigate))]
                ;
            scrollToRef(refToNavigate);
            // if (!scrollToRef(refToNavigate)) {
            //     setTimeout(scrollToCurrentPath, 250);
            // }
        }
    }, [pathToNavigate]);

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

export const BookNodesComp: Comp<{ nodes: ContentNode[] }> = (props =>
    <>
        {
            buildNodes(props.nodes, [], {
                refPathHandler: () => undefined,
                pageRange: bookRange(),
            })
        }
    </>
);

type PathLinkProps = {
    path: BookPath | undefined,
    id: BookId,
    text: string,
};
const PathLink: Comp<PathLinkProps> = (props =>
    props.path === undefined ? null :
        <Row centered margin={point(1)}>
            <BorderButton
                action={actionCreators
                    .navigateToBook(bookLocator(props.id, locationPath(props.path)))}
                text={props.text}
            />
        </Row>
);

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

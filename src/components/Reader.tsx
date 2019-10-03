import * as React from 'react';

import {
    BookPath, BookRange, Callback, fragmentForPath,
} from 'booka-common';
import {
    BookId, bookLocator, locationPath, titleForPath, BookObject,
    colors, Theme, fontSize, highlights,
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
    book: { id, book },
    toggleControls,
    theme,
    openFootnote,
    quoteRange,
}: ReaderProps) {
    const fragment = fragmentForPath(book, pathToOpen || []);

    const prevTitle = fragment.previous && titleForPath(book.volume, fragment.previous)[0];
    const nextTitle = fragment.next && titleForPath(book.volume, fragment.next)[0];

    const selection = React.useRef<BookSelection | undefined>(undefined);
    const selectionHandler = React.useCallback((sel: BookSelection | undefined) => {
        selection.current = sel;
    }, []);
    useCopy(React.useCallback((e: ClipboardEvent) => {
        if (selection.current && e.clipboardData) {
            e.preventDefault();
            const selectionText = `${selection.current.text}\n${generateQuoteLink(id, selection.current.range)}`;
            e.clipboardData.setData('text/plain', selectionText);
        }
    }, [id]));
    const colorization = quoteRange
        ? [{
            color: highlights(theme).quote,
            range: quoteRange,
        }]
        : undefined;

    return <Scroll>
        <Row fullWidth centered>
            <Column maxWidth={point(50)} fullWidth padding={point(1)} centered>
                <EmptyLine />
                <PathLink path={fragment.previous} id={id} text={prevTitle || 'Previous'} />
                <Clickable onClick={toggleControls}>
                    <Column>
                        <BookFragmentComp
                            fragment={fragment}
                            colorization={colorization}
                            color={colors(theme).text}
                            refColor={colors(theme).accent}
                            refHoverColor={colors(theme).highlight}
                            fontFamily={theme.fontFamilies.book}
                            fontSize={fontSize(theme, 'text')}
                            onScroll={updateBookPosition}
                            pathToScroll={pathToOpen || undefined}
                            onSelectionChange={selectionHandler}
                            onRefClick={openFootnote}
                        />
                    </Column>
                </Clickable>
                <PathLink path={fragment.next} id={id} text={nextTitle || 'Next'} />
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

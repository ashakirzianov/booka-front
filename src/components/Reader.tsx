import * as React from 'react';

import {
    BookPath, BookRange, fragmentForPath,
} from 'booka-common';
import {
    BookId, bookLocator, locationPath, titleForPath, BookObject,
    colors, fontSize, highlights, HasTheme, App,
} from '../model';
import {
    Row, Column, point, BorderButton,
    Scroll, Clickable, EmptyLine, useCopy,
} from '../atoms';
import { actionCreators, generateQuoteLink } from '../core';
import { BookFragmentComp, BookSelection } from '../reader';
import { dispatch } from '../core/store';
import { connect } from 'react-redux';

export type ReaderProps = HasTheme & {
    book: BookObject,
    pathToOpen: BookPath | null,
    quoteRange: BookRange | undefined,
    // updateBookPosition: Callback<BookPath>,
    // toggleControls: Callback<void>,
    // openFootnote: Callback<string>,
};
function Reader({
    pathToOpen,
    book: { id, book },
    theme,
    quoteRange,
    // updateBookPosition,
    // toggleControls,
    // openFootnote,
}: ReaderProps) {
    const fragment = fragmentForPath(book, pathToOpen || []);

    const prevTitle = fragment.previous && titleForPath(book, fragment.previous);
    const nextTitle = fragment.next && titleForPath(book, fragment.next);

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
                <PathLink
                    theme={theme}
                    path={fragment.previous}
                    id={id}
                    text={prevTitle !== undefined ? prevTitle[0] : 'Previous'}
                />
                <Clickable onClick={() => {
                    dispatch(actionCreators.toggleControls());
                }}>
                    <Column>
                        <BookFragmentComp
                            fragment={fragment}
                            colorization={colorization}
                            color={colors(theme).text}
                            refColor={colors(theme).accent}
                            refHoverColor={colors(theme).highlight}
                            fontFamily={theme.fontFamilies.book}
                            fontSize={fontSize(theme, 'text')}
                            onScroll={path => {
                                dispatch(actionCreators.updateBookPosition(
                                    path
                                ));
                            }}
                            pathToScroll={pathToOpen || undefined}
                            onSelectionChange={selectionHandler}
                            onRefClick={refId => {
                                dispatch(actionCreators.openFootnote(refId));
                            }}
                        />
                    </Column>
                </Clickable>
                <PathLink
                    theme={theme}
                    path={fragment.next}
                    id={id}
                    text={nextTitle !== undefined ? nextTitle[0] : 'Next'}
                />
                <EmptyLine />
            </Column>
        </Row>
    </Scroll>;
}

// TODO: fix: use typed 'connect'
export const ConnectedReader = connect(
    ({ theme, pathToOpen }: App) => ({
        theme, pathToOpen,
    }),
)(Reader);

type PathLinkProps = HasTheme & {
    path: BookPath | undefined,
    id: BookId,
    text: string,
};
function PathLink(props: PathLinkProps) {
    if (props.path === undefined) {
        return null;
    }
    const path = props.path;
    return <Row centered margin={point(1)}>
        <BorderButton
            theme={props.theme}
            onClick={() => {
                dispatch(actionCreators.navigateToBook(
                    bookLocator(props.id, locationPath(path))
                ));
            }}
            text={props.text}
            fontFamily='book'
        />
    </Row>;
}

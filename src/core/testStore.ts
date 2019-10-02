import { Provider } from 'react-redux';
import React from 'react';
import { VolumeNode, tocForBook, Book } from 'booka-common';
import { Action } from './actions';
import { App, BookScreen, BookObject, BookId } from '../model';
import { reducer } from './reducers';
import { defaultTheme } from './persistent';
import { short } from './testBooks';
import { createEnhancedStore } from '../utils';

class AppProvider extends Provider<Action> { }
export const TestProvider: React.SFC = props =>
    React.createElement(AppProvider, { store: store }, props.children);

const volume: VolumeNode = short;
const bookId: BookId = { name: 'test' };
const book: Book = { volume, tags: [] };
const bookObject: BookObject = {
    id: bookId,
    toc: tocForBook(book),
    book: book,
};

export const bookScreen: BookScreen = {
    screen: 'book',
    bl: {
        id: bookId,
        toc: false,
        footnoteId: undefined,
        location: { location: 'path', path: [] },
    },
    book: bookObject,
};

const state: App = {
    pathToOpen: null,
    controlsVisible: true,
    theme: defaultTheme,
    loading: false,
    screen: bookScreen,
};

const store = createEnhancedStore(reducer, state);

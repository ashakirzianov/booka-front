import { Provider } from 'react-redux';
import React from 'react';
import { Action } from './actions';
import { App, BookScreen, Book, BookId, tocFromVolume } from '../model';
import { reducer } from './reducers';
import { defaultTheme } from './persistent';
import { short } from './testBooks';
import { createEnhancedStore } from '../utils';
import { VolumeNode } from 'booka-common';

class AppProvider extends Provider<Action> { }
export const TestProvider: React.SFC = props =>
    React.createElement(AppProvider, { store: store }, props.children);

const volume: VolumeNode = short;
const bookId: BookId = { name: 'test' };
const book: Book = {
    id: bookId,
    toc: tocFromVolume(volume, bookId),
    volume,
    idDictionary: { image: {} },
};

export const bookScreen: BookScreen = {
    screen: 'book',
    bl: {
        id: bookId,
        toc: false,
        footnoteId: undefined,
        location: { location: 'path', path: [] },
    },
    book: book,
};

const state: App = {
    pathToOpen: null,
    controlsVisible: true,
    theme: defaultTheme,
    loading: false,
    screen: bookScreen,
};

const store = createEnhancedStore(reducer, state);

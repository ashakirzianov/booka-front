import {
    BookId, BookPath, library, Book,
    Library, BookInfo, Theme,
} from '../model';
import { smartStore, forEach, singleValueStore } from '../utils';
import { subscribe } from '../redux';

const stores = {
    books: smartStore<Book>('books'),
    library: smartStore<BookInfo>('library'),
    positions: smartStore<BookPath>('positions'),
    theme: singleValueStore<Theme>('theme'),
};

export function bookFromStore(bi: BookId): Book | undefined {
    return stores.books.get(bi.name);
}

export function storeBook(book: Book) {
    stores.books.set(book.id.name, book);
}

export function cachedLibrary(): Library {
    return library(stores.library.all());
}

export function cacheLibrary(lib: Library) {
    forEach(lib.books, (id, info) => stores.library.set(id, info));
}

export async function resolveCurrentPosition(bi: BookId): Promise<BookPath> {
    return stores.positions.get(bi.name) || [];
}

export function setCurrentPosition(bookId: BookId, path: BookPath) {
    stores.positions.set(bookId.name, path);
}

setTimeout(() => subscribe(state => {
    const { screen } = state;
    if (screen.screen === 'book' && screen.bl.location.location === 'path') {
        const id = screen.book.id;
        const position = screen.bl.location.path;
        setCurrentPosition(id, position);
    }
}));

// ---- Theme

const defaultTheme: Theme = {
    palettes: {
        light: {
            text: '#000',
            primary: '#fff',
            secondary: '#eee',
            accent: '#777',
            highlight: '#aaf',
            shadow: '#000',
        },
        sepia: {
            text: '#5f3e24',
            primary: '#f9f3e9',
            secondary: '#e6e0d6',
            accent: '#987',
            highlight: '#321',
            shadow: '#000',
        },
        dark: {
            text: '#999',
            primary: '#000',
            secondary: '#222',
            accent: '#ddd',
            highlight: '#fff',
            shadow: '#000',
        },
    },
    currentPalette: 'light',
    fontFamily: 'Georgia',
    fontSize: {
        normal: 26,
        large: 30,
        largest: 36,
    },
    fontScale: 1,
    radius: 5,
};

export function restoreTheme(): Theme {
    return stores.theme.get() || defaultTheme;
}

setTimeout(() => subscribe(state => {
    stores.theme.set(state.theme);
}));

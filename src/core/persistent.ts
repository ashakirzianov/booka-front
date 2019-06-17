import {
    BookId, BookPath, library, Book,
    Library, BookInfo, Theme,
} from '../model';
import { smartStore, forEach, singleValueStore } from '../utils';

export const stores = {
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

// ---- Theme

const defaultTheme: Theme = {
    palettes: {
        light: {
            colors: {
                text: '#000',
                primary: '#fff',
                secondary: '#eee',
                accent: '#777',
                highlight: '#aaf',
                shadow: '#000',
            },
            highlights: {
                quote: '#fbe381',
            },
        },
        sepia: {
            colors: {
                text: '#5f3e24',
                primary: '#f9f3e9',
                secondary: '#e6e0d6',
                accent: '#987',
                highlight: '#321',
                shadow: '#000',
            },
            highlights: {
                quote: '#fbe381',
            },
        },
        dark: {
            colors: {
                text: '#999',
                primary: '#000',
                secondary: '#222',
                accent: '#ddd',
                highlight: '#fff',
                shadow: '#000',
            },
            highlights: {
                quote: '#c8b050',
            },
        },
    },
    currentPalette: 'light',
    fontFamilies: {
        main: 'Georgia',
        menu: 'Helvetica',
    },
    fontSizes: {
        smallest: 14,
        small: 22,
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

import { Book } from "./book";
import { Library } from './library';
import { Loadable } from './base';

export type App = {
    screen: Screen,
};

export type Screen = BookScreen | LibraryScreen;
export type BookScreen = ReturnType<typeof bookScreen>;
export type LibraryScreen = ReturnType<typeof libraryScreen>;

export function bookScreen(book: Loadable<Book>) {
    return {
        screen: 'book' as 'book',
        book: book,
    };
}

export function libraryScreen(library: Loadable<Library>) {
    return {
        screen: 'library' as 'library',
        library: library,
    };
}

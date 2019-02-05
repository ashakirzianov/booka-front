import { Book } from "./book";
import { Library } from './library';
import { BookLocator } from './bookLocator';

export type App = {
    screenStack: ScreenStack,
};

export type ScreenStack = Screen[];

export function popScreen(stack: ScreenStack): ScreenStack {
    return stack.length > 1 ? stack.slice(0, stack.length - 1) : stack;
}

export function pushScreen(stack: ScreenStack, screen: Screen): ScreenStack {
    const newStack = stack.slice();
    newStack.push(screen);

    return newStack;
}

export function topScreen(stack: ScreenStack): Screen {
    return stack.length > 0
        ? stack[stack.length - 1]
        : blankScreen()
        ;
}

export type Screen = BookScreen | LibraryScreen | BlankScreen;
export type BookScreen = 
    | ReturnType<typeof bookScreen>
    //| ReturnType<typeof loadBookScreen>
    ;
export type LibraryScreen =
    | ReturnType<typeof libraryScreen>
    //| ReturnType<typeof loadingLibraryScreen>
    ;
export type BlankScreen = ReturnType<typeof blankScreen>;

export function bookScreen(book: Book, bl: BookLocator) {
    return {
        screen: 'book' as 'book',
        book: book,
        bl: bl,
        loading: false as false,
    };
}

export function loadBookScreen(bl: BookLocator) {
    return {
        screen: 'book' as 'book',
        bl: bl,
        loading: true as true,
    };
}

export function libraryScreen(library: Library) {
    return {
        screen: 'library' as 'library',
        library: library,
        loading: false as false,
    };
}

export function loadingLibraryScreen() {
    return {
        screen: 'library' as 'library',
        loading: true as true,
    };
}

export function blankScreen() {
    return {
        screen: 'blank' as 'blank',
    };
}

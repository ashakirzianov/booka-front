import { Book } from "./book";
import { Library } from './library';
import { Loadable } from './base';

export type App = {
    screenStack: ScreenStack,
    library: Loadable<Library>,
    currentBook: Loadable<Book>,
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

export type Screen = BookScreen | LibraryScreen;
export type BookScreen = ReturnType<typeof bookScreen>;
export type LibraryScreen = ReturnType<typeof libraryScreen>;

export function bookScreen() {
    return {
        screen: 'book' as 'book',
    };
}

export function libraryScreen() {
    return {
        screen: 'library' as 'library',
    };
}

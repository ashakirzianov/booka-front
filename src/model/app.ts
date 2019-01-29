import { Book } from "./book";
import { Library } from './library';

export type App = {
    screenStack: ScreenStack,
    library: Library,
    currentBook: Book,
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
export type BookScreen = ReturnType<typeof bookScreen>;
export type LibraryScreen = ReturnType<typeof libraryScreen>;
export type BlankScreen = ReturnType<typeof blankScreen>;

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

export function blankScreen() {
    return {
        screen: 'blank' as 'blank',
    }
}

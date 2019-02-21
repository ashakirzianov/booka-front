import { Book } from './book';
import { BookLocator } from './bookLocator';
import { Library } from './library';

export type ScreenStack = Screen[];

export function emptyStack(): ScreenStack {
    return [];
}

export function popScreen(stack: ScreenStack): ScreenStack {
    return stack.length > 1 ? stack.slice(0, stack.length - 1) : stack;
}

export function pushScreen(stack: ScreenStack, screen: Screen): ScreenStack {
    const newStack = stack.slice();
    newStack.push(screen);

    return newStack;
}

export function replaceScreen(stack: ScreenStack, screen: Screen) {
    const index = stack.length > 0 ? stack.length - 1 : 0;
    const newStack = stack.slice();
    newStack[index] = screen;

    return newStack;
}

export function topScreen(stack: ScreenStack): Screen | undefined {
    return stack.length > 0
        ? stack[stack.length - 1]
        : undefined
        ;
}

type ForScreenMap<T> = {
    book?: (screen: BookScreen) => T,
    library?: (screen: LibraryScreen) => T,
};

export function stackForScreen(stack: ScreenStack, map: ForScreenMap<Screen>): ScreenStack {
    const top = topScreen(stack);
    const next = top && forScreen(top, map);

    return top === next || next === undefined
        ? stack
        : replaceScreen(stack, next);
}

export function forScreen<T>(screen: Screen, map: ForScreenMap<T>): T | undefined {
    const f = map[screen.screen];
    if (f !== undefined) {
        const result = f(screen as any); // TODO: try to remove 'as any'
        return result;
    }

    return undefined;
}

export type Screen = BookScreen | LibraryScreen;
export type BookScreen = 
    | ReturnType<typeof bookScreen>
    ;
export type LibraryScreen =
    | ReturnType<typeof libraryScreen>
    ;

export function bookScreen(book: Book, bl: BookLocator) {
    return {
        screen: 'book' as 'book',
        book: book,
        bl: bl,
    };
}

export function libraryScreen(library: Library) {
    return {
        screen: 'library' as 'library',
        library: library,
    };
}

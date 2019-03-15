import { Book } from './book';
import { BookLocator } from './bookLocator';
import { Library } from './library';
import { TableOfContents } from './tableOfContent';

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

type MapValue<S extends Screen, T> = T | ((screen: S) => T);
type ForScreenMap<T> = {
    default: MapValue<Screen, T>,
    book: MapValue<BookScreen, T>,
    library: MapValue<LibraryScreen, T>,
    toc: MapValue<TocScreen, T>,
};
type DefaultScreen<T> = {
    default: MapValue<Screen, T>,
};

export function forScreen<T>(screen: Screen, map: ForScreenMap<T> | DefaultScreen<T> & Partial<ForScreenMap<T>>): T;
export function forScreen<T>(screen: Screen, map: Partial<ForScreenMap<T>>): T | undefined;
export function forScreen<T>(screen: Screen, map: Partial<DefaultScreen<T> & ForScreenMap<T>>): T | undefined {
    const funcOrValue = map[screen.screen] !== undefined
        ? map[screen.screen]
        : map.default;
    if (funcOrValue !== undefined) {
        if (typeof funcOrValue === 'function') {
            const func = funcOrValue as any; // TODO: try to remove 'as any'
            const result = func(screen);
            return result;
        } else {
            return funcOrValue;
        }
    }

    return undefined;
}

export function stackForScreen(stack: ScreenStack, map: ForScreenMap<Screen>): ScreenStack {
    const top = topScreen(stack);
    const next = top && forScreen(top, map);

    return top === next || next === undefined
        ? stack
        : replaceScreen(stack, next);
}

export type Screen =
    | BookScreen | LibraryScreen | TocScreen
    ;
export type BookScreen = ReturnType<typeof bookScreen>;
export type LibraryScreen = ReturnType<typeof libraryScreen>;
export type TocScreen = ReturnType<typeof tocScreen>;

export function bookScreen(book: Book, bl: BookLocator) {
    return {
        screen: 'book' as 'book',
        book: book,
        tocOpen: false,
        bl: bl,
    };
}

export function libraryScreen(library: Library) {
    return {
        screen: 'library' as 'library',
        library: library,
    };
}

export function tocScreen(toc: TableOfContents, bl: BookLocator) {
    return {
        screen: 'toc' as 'toc',
        toc: toc,
        bl: bl,
    };
}

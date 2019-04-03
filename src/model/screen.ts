import { Book } from './book';
import { BookLocator } from './bookLocator';
import { Library } from './library';

export type ScreenStack = AppScreen[];

export function emptyStack(): ScreenStack {
    return [];
}

export function popScreen(stack: ScreenStack): ScreenStack {
    return stack.length > 1 ? stack.slice(0, stack.length - 1) : stack;
}

export function pushScreen(stack: ScreenStack, screen: AppScreen): ScreenStack {
    const newStack = stack.slice();
    newStack.push(screen);

    return newStack;
}

export function replaceScreen(stack: ScreenStack, screen: AppScreen) {
    const index = stack.length > 0 ? stack.length - 1 : 0;
    const newStack = stack.slice();
    newStack[index] = screen;

    return newStack;
}

export function topScreen(stack: ScreenStack): AppScreen | undefined {
    return stack.length > 0
        ? stack[stack.length - 1]
        : undefined
        ;
}

type MapValue<S extends AppScreen, T> = T | ((screen: S) => T);
type ForScreenMap<T> = {
    default: MapValue<AppScreen, T>,
    book: MapValue<BookScreen, T>,
    library: MapValue<LibraryScreen, T>,
};
type DefaultScreen<T> = {
    default: MapValue<AppScreen, T>,
};

export function forScreen<T>(screen: AppScreen, map: ForScreenMap<T> | DefaultScreen<T> & Partial<ForScreenMap<T>>): T;
export function forScreen<T>(screen: AppScreen, map: Partial<ForScreenMap<T>>): T | undefined;
export function forScreen<T>(screen: AppScreen, map: Partial<DefaultScreen<T> & ForScreenMap<T>>): T | undefined {
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

export function stackForScreen(stack: ScreenStack, map: ForScreenMap<AppScreen>): ScreenStack {
    const top = topScreen(stack);
    const next = top && forScreen(top, map);

    return top === next || next === undefined
        ? stack
        : replaceScreen(stack, next);
}

export type AppScreen =
    | BookScreen | LibraryScreen
    ;
export type BookScreen = ReturnType<typeof bookScreen>;
export type LibraryScreen = ReturnType<typeof libraryScreen>;

export function bookScreen(book: Book, bl: BookLocator, tocOpen?: boolean, footnoteId?: string) {
    return {
        screen: 'book' as 'book',
        book: book,
        footnoteId: footnoteId || null,
        tocOpen: tocOpen ? true : false,
        bl: bl,
    };
}

export function libraryScreen(library: Library) {
    return {
        screen: 'library' as 'library',
        library: library,
    };
}

import { def } from "../utils";
import { Screen } from './screen';
import { Library } from './library';
import { BookLocator, BookPath } from './bookLocator';
import { Book } from './book';

export type LoadBookDesc = {
    locator: BookLocator,
    book: Book,
};

export const actionsTemplate = {
    navigateToScreen: def<Screen>(),
    loadBook: def<Promise<LoadBookDesc>>(),
    loadLibrary: def<Promise<Library>>(),
    updateCurrentBookPosition: def<BookPath>(),
};
export type ActionsTemplate = typeof actionsTemplate;

import { def } from "../utils";
import { Screen } from './screen';
import { Library } from './library';
import { BookLocator } from './bookLocator';
import { Book } from './book';

export type LoadBookDesc = {
    locator: BookLocator,
    book: Book,
};

export const actionsTemplate = {
    navigateToScreen: def<Screen>(),
    navigateBack: def(),
    loadBook: def<Promise<LoadBookDesc>>(),
    loadLibrary: def<Promise<Library>>(),
};
export type ActionsTemplate = typeof actionsTemplate;

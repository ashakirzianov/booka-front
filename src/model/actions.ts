import { def, PromisePlus } from "../utils";
import { Book } from "./book";
import { Library } from './library';
import { BookLocator } from './bookLocator';

export const actionsTemplate = {
    setCurrentBook: def<PromisePlus<Book, BookLocator>>(),
    loadLibrary: def<Promise<Library>>(),
    navigateToBookScreen: def(),
    navigateToLibraryScreen: def(),
};
export type ActionsTemplate = typeof actionsTemplate;

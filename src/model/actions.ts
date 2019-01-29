import { def } from "../utils";
import { Book } from "./book";
import { Library } from './library';
import { BookLocator } from './bookLocator';
import { PromisePlus } from '../promisePlus';

export const actionsTemplate = {
    setCurrentBook: def<PromisePlus<Book, BookLocator>>(),
    loadLibrary: def<Promise<Library>>(),
    navigateToBookScreen: def(),
    navigateToLibraryScreen: def(),
};
export type ActionsTemplate = typeof actionsTemplate;

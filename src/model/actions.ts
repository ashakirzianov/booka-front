import { def } from "../utils";
import { Book } from "./book";
import { Library } from './library';
import { OptimisticPromise } from '../promisePlus';

export const actionsTemplate = {
    setCurrentBook: def<OptimisticPromise<Book>>(),
    loadLibrary: def<OptimisticPromise<Library>>(),
    navigateToBookScreen: def(),
    navigateToLibraryScreen: def(),
};
export type ActionsTemplate = typeof actionsTemplate;

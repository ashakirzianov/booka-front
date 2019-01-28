import { def } from "../utils";
import { Book } from "./book";
import { Library } from './library';

export const actionsTemplate = {
    setCurrentBook: def<Promise<Book>>(),
    loadLibrary: def<Promise<Library>>(),
};
export type ActionsTemplate = typeof actionsTemplate;

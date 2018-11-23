import { def } from "../utils";
import { Book } from "./book";
import { Library } from './library';

export const actionsTemplate = {
    setBook: def<Promise<Book>>(),
    loadLib: def<Promise<Library>>(),
};
export type ActionsTemplate = typeof actionsTemplate;

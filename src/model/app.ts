import { Book } from "./book";
import { Library } from './library';
import { Loadable } from './base';

export type App = {
    book: Loadable<Book>,
    library: Loadable<Library>,
};

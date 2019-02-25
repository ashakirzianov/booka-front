import { def } from '../utils';
import { Screen } from './screen';
import { Library } from './library';
import { BookPath } from './bookLocator';
import { Book } from './book';

export const actionsTemplate = {
    navigateToScreen: def<Screen>(),
    loadBook: def<Promise<Book>>(),
    loadLibrary: def<Promise<Library>>(),
    updateCurrentBookPosition: def<BookPath>(),
    toggleControls: def(),
};
export type ActionsTemplate = typeof actionsTemplate;

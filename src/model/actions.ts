import { def } from '../utils';
import { Screen } from './screen';
import { BookPath } from './bookLocator';
import { OptimisticPromise } from '../promisePlus';

export const actionsTemplate = {
    navigateToScreen: def<OptimisticPromise<Screen>>(),
    updateCurrentBookPosition: def<BookPath>(),
    toggleControls: def(),
    toggleToc: def(),
    openFootnote: def<string | null>(),
};
export type ActionsTemplate = typeof actionsTemplate;

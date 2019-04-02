import { def } from '../utils';
import { Screen } from './screen';
import { OptimisticPromise } from '../promisePlus';
import { PaletteName } from './theme';
import { BookPath } from './bookLocator';

export const actionsTemplate = {
    navigateToScreen: def<OptimisticPromise<Screen>>(),
    updateBookPosition: def<BookPath>(),
    toggleControls: def(),
    toggleToc: def(),
    openFootnote: def<string | null>(),
    setPalette: def<PaletteName>(),
    incrementScale: def<number>(),
};
export type ActionsTemplate = typeof actionsTemplate;

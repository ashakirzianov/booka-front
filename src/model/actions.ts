import { def } from '../utils';
import { Screen } from './screen';
import { BookPath } from './bookLocator';
import { OptimisticPromise } from '../promisePlus';
import { PaletteName } from './theme';

export const actionsTemplate = {
    navigateToScreen: def<OptimisticPromise<Screen>>(),
    updateCurrentBookPosition: def<BookPath>(),
    toggleControls: def(),
    toggleToc: def(),
    openFootnote: def<string | null>(),
    setPalette: def<PaletteName>(),
    incrementScale: def<number>(),
};
export type ActionsTemplate = typeof actionsTemplate;

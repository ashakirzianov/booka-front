import { def } from '../utils';
import { Screen } from './screen';
import { OptimisticPromise } from '../promisePlus';
import { PaletteName } from './theme';
import { BookPosition } from './syncable';

export const actionsTemplate = {
    navigateToScreen: def<OptimisticPromise<Screen>>(),
    updateBookPosition: def<BookPosition>(),
    toggleControls: def(),
    toggleToc: def(),
    openFootnote: def<string | null>(),
    setPalette: def<PaletteName>(),
    incrementScale: def<number>(),
};
export type ActionsTemplate = typeof actionsTemplate;

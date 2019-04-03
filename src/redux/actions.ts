import { def } from '../utils';
import { PaletteName, NavigationObject, BookPath, Screen } from '../model';

export const actionsTemplate = {
    navigate: def<NavigationObject>(),
    pushScreen: def<Screen>(),
    updateBookPosition: def<BookPath>(),
    toggleControls: def(),
    toggleToc: def(),
    openFootnote: def<string | null>(),
    setPalette: def<PaletteName>(),
    incrementScale: def<number>(),
};
export type ActionsTemplate = typeof actionsTemplate;

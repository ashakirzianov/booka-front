import { def } from '../utils';
import { PaletteName, NavigationObject, BookPath, AppScreen } from '../model';

export const actionsTemplate = {
    navigate: def<NavigationObject>(),
    pushScreen: def<AppScreen>(),
    updateBookPosition: def<BookPath>(),
    toggleControls: def(),
    toggleToc: def(),
    openFootnote: def<string | null>(),
    setPalette: def<PaletteName>(),
    incrementScale: def<number>(),
};
export type ActionsTemplate = typeof actionsTemplate;

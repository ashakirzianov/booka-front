import { def } from '../utils';
import { PaletteName } from './theme';
import { BookPath } from './bookLocator';
import { NavigationObject } from './navigationObject';
import { Screen } from './screen';

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

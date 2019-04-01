import { Screen } from './screen';
import { BookPath } from './bookLocator';
import { Theme } from './theme';
import { Syncable } from './syncable';

export type App = {
    screen: Screen,
    pathToOpen: BookPath | null,
    controlsVisible: boolean,
    theme: Theme,
    syncable: Syncable,
};

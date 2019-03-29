import { Screen } from './screen';
import { BookPath } from './bookLocator';
import { Theme } from './theme';

export type App = {
    screen: Screen,
    pathToOpen: BookPath | null,
    controlsVisible: boolean,
    theme: Theme,
};

import { AppScreen } from './screen';
import { BookPath } from './bookLocator';
import { Theme } from './theme';

export type App = {
    screen: AppScreen,
    pathToOpen: BookPath | null,
    controlsVisible: boolean,
    theme: Theme,
};

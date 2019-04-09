import { AppScreen } from './screen';
import { BookPath } from './bookRange';
import { Theme } from './theme';

export type App = {
    screen: AppScreen,
    pathToOpen: BookPath | null,
    controlsVisible: boolean,
    theme: Theme,
    loading: boolean,
};

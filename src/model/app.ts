import { AppScreen } from './screen';
import { BookPath } from './bookRange';
import { Theme } from './theme';
import { User } from './user';

export type App = {
    screen: AppScreen,
    pathToOpen: BookPath | null,
    controlsVisible: boolean,
    theme: Theme,
    loading: boolean,
    user?: User,
};

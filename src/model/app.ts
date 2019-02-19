import { Screen } from './screen';
import { BookPath } from './bookLocator';

export type App = {
    screen: Screen,
    positionToNavigate: BookPath | null,
};

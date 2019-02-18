import { ScreenStack } from './screen';
import { BookPath } from './bookLocator';

export type App = {
    screenStack: ScreenStack,
    positionToNavigate: BookPath | null,
};

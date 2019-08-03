import { PaletteName, BookPath, AppScreen, BookLocator, User } from '../model';
import { actionCreator, ActionFromCreators } from '../utils';

export const actionCreators = {
    navigateToBook: actionCreator<BookLocator>()('navigateToBook'),
    navigateToLibrary: actionCreator()('navigateToLibrary'),
    pushScreen: actionCreator<AppScreen>()('pushScreen'),
    updateBookPosition: actionCreator<BookPath>()('updateBookPosition'),
    toggleControls: actionCreator()('toggleControls'),
    toggleToc: actionCreator()('toggleToc'),
    openFootnote: actionCreator<string | null>()('openFootnote'),
    setPalette: actionCreator<PaletteName>()('setPalette'),
    incrementScale: actionCreator<number>()('incrementScale'),
    setUser: actionCreator<User | undefined>()('setUser'),
};

export type Action = ActionFromCreators<typeof actionCreators>;

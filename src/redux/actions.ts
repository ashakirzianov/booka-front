import { PaletteName, NavigationObject, BookPath, AppScreen } from '../model';
import { actionCreator, ActionsType } from './redux-utils';

export const actionCreators = {
    navigate: actionCreator<NavigationObject>()('navigate'),
    pushScreen: actionCreator<AppScreen>()('pushScreen'),
    updateBookPosition: actionCreator<BookPath>()('updateBookPosition'),
    toggleControls: actionCreator()('toggleControls'),
    toggleToc: actionCreator()('toggleToc'),
    openFootnote: actionCreator<string | null>()('openFootnote'),
    setPalette: actionCreator<PaletteName>()('setPalette'),
    incrementScale: actionCreator<number>()('incrementScale'),
};

export type Action = ActionsType<typeof actionCreators>;

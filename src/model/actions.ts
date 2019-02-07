import { def } from "../utils";
import { Screen, LoadBookDesc } from './app';
import { Library } from './library';

export const actionsTemplate = {
    navigateToScreen: def<Screen>(),
    navigateBack: def(),
    loadBook: def<Promise<LoadBookDesc>>(),
    loadLibrary: def<Promise<Library>>(),
};
export type ActionsTemplate = typeof actionsTemplate;

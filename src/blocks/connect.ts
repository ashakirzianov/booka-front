import * as React from 'react';

import { buildConnectRedux } from '../utils';
import { Theme, App, Palette } from '../model';
import { actionCreators } from '../core';

export const { connect, connectState, connectActions, connectAll } = buildConnectRedux<App, typeof actionCreators>(actionCreators);

export type Themeable<T = {}> = T & {
    theme: Theme,
};
type ThemeableComp<T> = React.ComponentType<Themeable<T>>;
export function themed<T = {}>(C: ThemeableComp<T>) {
    const result = connectState('theme')(C);
    result.displayName = (C as any).name;
    return result;
}

// TODO: move to model
export function colors(themeable: Themeable): Palette['colors'] {
    return themeable.theme.palettes[themeable.theme.currentPalette].colors;
}

// TODO: move to model
export function highlights(themeable: Themeable): Palette['highlights'] {
    return themeable.theme.palettes[themeable.theme.currentPalette].highlights;
}

import { buildConnectRedux } from '../utils';
import { Theme, App, Palette } from '../model';
import { Comp } from '../atoms';
import { actionCreators } from '../core';

export const { connect, connectState, connectActions, connectAll } = buildConnectRedux<App, typeof actionCreators>(actionCreators);

export type Themeable = {
    theme: Theme,
};
type ThemeableComp<T> = Comp<T & Themeable>;
export function themed<T = {}>(C: ThemeableComp<T>) {
    return connectState('theme')(C);
}
export function colors(themeable: Themeable): Palette['colors'] {
    return themeable.theme.palettes[themeable.theme.currentPalette].colors;
}

export function highlights(themeable: Themeable): Palette['highlights'] {
    return themeable.theme.palettes[themeable.theme.currentPalette].highlights;
}

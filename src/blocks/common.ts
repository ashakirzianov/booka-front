import * as React from 'react';

import {
    Func, platformValue,
    buildConnectRedux,
} from '../utils';
import { actionCreators } from '../core';
import { App, Theme, Palette } from '../model';

export type ReactContent = React.ReactNode;
export type Callback<Argument> = Func<Argument, void>;
export type Callbacks<A> = {
    [name in keyof A]: Callback<A[name]>;
};
export type CallbacksOpt<A> = Partial<Callbacks<A>>;
export type Comp<P = {}> = React.ComponentType<P>;
export type Props<P> = React.PropsWithChildren<P>;

export function relative(size: number) {
    return platformValue({
        web: `${size}em`,
        default: `${size}%`,
    });
}

export function absolute(size: number) {
    return `${size}`;
}

export const { connect, connectState, connectActions, connectAll } = buildConnectRedux<App, typeof actionCreators>(actionCreators);

export type Hoverable<T> = T & { ':hover'?: Partial<T> };

type Themeable = {
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

export function named<P>(C: Comp<P>, name: string): Comp<P> {
    C.displayName = name;
    return C;
}

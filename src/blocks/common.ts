import * as React from 'react';

import {
    Func, platformValue,
} from '../utils';

export type ReactContent = React.ReactNode;
export type Callback<Argument> = Func<Argument, void>;
export type Callbacks<A> = {
    [name in keyof A]: Callback<A[name]>;
};
export type CallbacksOpt<A> = Partial<Callbacks<A>>;
export type Comp<P = {}> = React.ComponentType<P>;

export type WithChildren<P = {}> = React.PropsWithChildren<P>;

export type Size = string | number;
export function percent(size: number) {
    return `${size}%`;
}

export function point(size: number) {
    return platformValue<Size>({
        web: `${size}em`,
        default: size * 12,
    });
}

export const defaults = {
    semiTransparent: 'rgba(0, 0, 0, 0.3)',
    animationDuration: 400,
    headerHeight: 2,
};

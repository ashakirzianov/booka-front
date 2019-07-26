import * as React from 'react';

import { platformValue } from '../utils';

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

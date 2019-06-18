import * as React from 'react';

import {
    FaTimes, FaAngleLeft, FaBars, FaFont,
} from 'react-icons/fa';
import { assertNever } from '../utils';
import { Comp } from './common';

export type IconName = 'close' | 'left' | 'items' | 'letter';

function iconForName(name: IconName) {
    switch (name) {
        case 'close':
            return FaTimes;
        case 'left':
            return FaAngleLeft;
        case 'items':
            return FaBars;
        case 'letter':
            return FaFont;
        default:
            return assertNever(name);
    }
}

export type IconProps = {
    name: IconName,
    size?: string,
};
export const Icon: Comp<IconProps> = (props =>
    React.createElement(iconForName(props.name), {
        ...props,
        size: props.size || '1em',
    })
);

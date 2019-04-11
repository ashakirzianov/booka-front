import * as React from 'react';

import {
    FaTimes, FaAngleLeft, FaBars, FaFont,
} from 'react-icons/fa';
import { assertNever } from '../utils';
import { comp } from './comp-utils';

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

export const Icon = comp<{ name: IconName, size?: string }>(props =>
    React.createElement(iconForName(props.name), props)
);

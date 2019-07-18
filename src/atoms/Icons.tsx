import * as React from 'react';

import {
    FaTimes, FaAngleLeft, FaBars, FaFont,
} from 'react-icons/fa';
import { assertNever } from '../utils';
import { Props } from './common';
import { IconProps, IconName } from './Icons.common';
import { HoverableText } from './Basic';

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

export function Icon({ size, name, color, hover }: Props<IconProps>) {
    return React.createElement(HoverableText,
        {
            color: color,
            hoverColor: hover,
        },
        React.createElement(iconForName(name), {
            size: size || '1em',
        }));
}

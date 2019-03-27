import * as React from 'react';

import { FaTimes, FaAngleLeft, FaBars } from 'react-icons/fa';
import { assertNever } from '../utils';
import { comp } from './comp-utils';

export type IconName = 'close' | 'left' | 'items';

function iconForName(name: IconName) {
    switch (name) {
        case 'close':
            return <FaTimes />;
        case 'left':
            return <FaAngleLeft />;
        case 'items':
            return <FaBars />;
        default:
            return assertNever(name);
    }
}

export const Icon = comp<{ name: IconName }>(props =>
    iconForName(props.name),
);

import * as React from 'react';

import { FaTimes } from 'react-icons/fa';
import { assertNever } from '../utils';
import { comp } from './comp-utils';

export type IconName = 'close';

function iconForName(name: IconName) {
    return name === 'close' ? <FaTimes />
        : assertNever(name);
}

export const Icon = comp<{ name: IconName }>(props =>
    iconForName(props.name),
);

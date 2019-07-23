import * as React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { assertNever } from '../utils';
import { Comp } from './common';
import { IconProps, IconName } from './Icons';

function convertIconName(name: IconName): string {
    switch (name) {
        case 'close':
            return 'times';
        case 'left':
            return 'angle-left';
        case 'items':
            return 'bars';
        case 'letter':
            return 'font';
        default:
            return assertNever(name);
    }
}

// TODO: implement size
export const Icon: Comp<IconProps> = (({ name, size, color }) =>
    <FontAwesome
        color={color}
        name={convertIconName(name)}
        size={size || 24}
    />
);

import * as React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { assertNever } from '../utils';
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

export function Icon({ name, size }: IconProps) {
    return <FontAwesome
        name={convertIconName(name)}
        size={size || 24}
    />;
}

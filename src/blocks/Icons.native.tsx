import * as React from 'react';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { assertNever } from '../utils';
import { Comp } from './common';
import { IconProps, IconName } from './Icons.common';

function convertIconName(name: IconName): string {
    switch (name) {
        case 'close':
            return 'fa-times';
        case 'left':
            return 'fa-angle-left';
        case 'items':
            return 'fa-bars';
        case 'letter':
            return 'fa-font';
        default:
            return assertNever(name);
    }
}

// TODO: implement size
export const Icon: Comp<IconProps> = (({ name }) =>
    <FontAwesome5 name={convertIconName(name)} />
);

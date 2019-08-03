import * as React from 'react';

import {
    FaTimes, FaAngleLeft, FaBars, FaFont,
    FaCircle, FaSignInAlt, FaFacebookSquare,
} from 'react-icons/fa';
import { assertNever } from '../utils';
import { Size } from './common';

export type IconName =
    | 'close' | 'left' | 'items' | 'letter'
    | 'circle' | 'sign-in' | 'facebook'
    ;

export type IconProps = {
    name: IconName,
    size?: Size,
};

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
        case 'circle':
            return FaCircle;
        case 'sign-in':
            return FaSignInAlt;
        case 'facebook':
            return FaFacebookSquare;
        default:
            return assertNever(name);
    }
}

export function Icon({ size, name }: IconProps) {
    return <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
        {React.createElement(iconForName(name), {
            size: size || '1em',
        })}
    </div>;
}

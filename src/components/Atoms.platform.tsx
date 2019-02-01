import * as React from 'react';
import { TextProps, TextCallbacks } from './Atoms.common';
import { Comp } from './comp-utils';

export const Text: Comp<TextProps, TextCallbacks> = props =>
    <span
        style={{
            ...props.style,
        }}
        onClick={props.onClick}
    >
        {props.children}
    </span>;

import * as React from 'react';
import { TextProps, TextCallbacks } from './Atoms';
import { Comp } from './comp-utils';

export const Text: Comp<TextProps, TextCallbacks> = props =>
    <span
        style={props.style}
        onClick={props.onClick}
    >
        {props.children}
    </span>;

export function showAlert(message: string) {
    alert(message);
}

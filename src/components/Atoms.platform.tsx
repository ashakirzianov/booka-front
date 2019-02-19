import * as React from 'react';
import { TextProps, TextCallbacks } from './Atoms';
import { Comp, VoidCallback } from './comp-utils';

export const Text: Comp<TextProps, TextCallbacks> = props =>
    <span
        style={props.style}
        onClick={props.onClick}
    >
        {props.children}
    </span>;

export const ClickResponder: Comp<{ onClick?: VoidCallback }> = (props =>
    <div onClick={props.onClick}>
        {props.children}
    </div>
);

export function showAlert(message: string) {
    alert(message);
}

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

export const Tab: Comp = (props =>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
);

export const Link: Comp<TextProps & {
    text: string,
    to: string,
}> = (props =>
    <a href={props.to} style={{
        textDecoration: 'none',
        ...props.style,
    }}>{props.text}</a>
    );

export function showAlert(message: string) {
    alert(message);
}

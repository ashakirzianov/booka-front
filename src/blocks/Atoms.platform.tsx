import * as React from 'react';
import { TextProps } from './Atoms';
import { Comp, isOpenNewTabEvent, Callback } from './comp-utils';
import { navigateToUrl } from '../logic';

export const Text: Comp<TextProps> = props =>
    <span
        style={props.style}
    >
        {props.children}
    </span>;

export const Button: Comp<{
    onClick: Callback<void>,
}> = (props =>
    <div
        style={{
            cursor: 'pointer',
        }}
        onClick={e => {
            e.stopPropagation();
            props.onClick();
        }}
    >
        {props.children}
    </div>
    );

export const Link: Comp<{
    to: string,
    action?: Callback<void>,
}> = (props =>
    <a
        href={props.to}
        style={{
            textDecoration: 'none',
            cursor: 'pointer',
        }}
        onClick={e => {
            e.stopPropagation();
            if (!isOpenNewTabEvent(e)) {
                e.preventDefault();
                if (props.action) {
                    props.action();
                } else {
                    navigateToUrl(props.to);
                }
            }
        }}
    >
        {props.children}
    </a>
    );

export function showAlert(message: string) {
    alert(message);
}

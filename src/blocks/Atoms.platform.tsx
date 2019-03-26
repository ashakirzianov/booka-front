import * as React from 'react';
import { TextProps } from './Atoms';
import { isOpenNewTabEvent, Callback, comp } from './comp-utils';
import { navigateToUrl } from '../logic';

export const Text = comp<TextProps>(props =>
    <span
        style={props.style}
    >
        {props.children}
    </span>,
);

export const Button = comp<{
    onClick: Callback<void>,
}>(props =>
    <div
        style={{
            display: 'inline',
            cursor: 'pointer',
        }}
        onClick={e => {
            e.stopPropagation();
            props.onClick();
        }}
    >
        {props.children}
    </div>,
);

export type LinkProps = {
    to: string,
    action?: Callback<void>, // TODO: rethinks this
};
export const Link = comp<LinkProps>(props =>
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
    </a>,
);

export function showAlert(message: string) {
    alert(message);
}

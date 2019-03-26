import * as React from 'react';
import { TextProps, TextPropsStyle } from './Atoms';
import { isOpenNewTabEvent, Callback, comp, hoverable, Hoverable } from './comp-utils';
import { navigateToUrl } from '../logic';

export const Text = comp<TextProps>(props =>
    <span
        style={props.style}
    >
        {props.children}
    </span>,
);

export type LinkProps = {
    to?: string,
    action?: Callback<void>, // TODO: rethinks this
    style?: Hoverable<TextPropsStyle>,
};
export const Link = hoverable<LinkProps>(props =>
    <a
        href={props.to}
        style={{
            textDecoration: 'none',
            cursor: 'pointer',
            ...props.style,
        }}
        onClick={e => {
            e.stopPropagation();
            if (!isOpenNewTabEvent(e)) {
                e.preventDefault();
                if (props.action) {
                    props.action();
                } else if (props.to) {
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

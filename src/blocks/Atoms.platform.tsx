import * as React from 'react';
import { TextProps, AtomTextStyle } from './Atoms';
import { isOpenNewTabEvent, Callback, hoverable, Hoverable } from './comp-utils';

export const Text = hoverable<TextProps>(props =>
    <span
        style={{
            wordBreak: 'break-word',
            ...props.style,
        }}
    >
        {props.children}
    </span>
);

export type LinkProps = {
    to?: string,
    onClick?: Callback<void>, // TODO: rethinks this
    style?: Hoverable<AtomTextStyle>,
};
export const Link = hoverable<LinkProps>(props =>
    <a
        href={props.to}
        style={{
            textDecoration: 'none',
            cursor: 'pointer',
            alignSelf: 'flex-start',
            ...props.style,
        }}
        onClick={e => {
            e.stopPropagation();
            if (!isOpenNewTabEvent(e)) {
                e.preventDefault();
                if (props.onClick) {
                    props.onClick();
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

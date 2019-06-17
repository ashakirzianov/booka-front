import * as React from 'react';
import { TextProps, LayoutProps } from './Atoms';
import { isOpenNewTabEvent, hoverable } from './comp-utils.platform';
import { Callback } from './comp-utils';

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

export type LinkProps = LayoutProps & {
    to?: string,
    onClick?: Callback<void>, // TODO: rethinks this
};
export const Link = hoverable<LinkProps>(props =>
    <a
        href={props.to}
        style={{
            ...props.style,
            textDecoration: 'none',
            cursor: 'pointer',
            alignSelf: 'flex-start',
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

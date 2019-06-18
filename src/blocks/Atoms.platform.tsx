import * as React from 'react';
import { TextProps, LayoutProps } from './Atoms';
import { isOpenNewTabEvent, hoverable } from './comp-utils.platform';
import { Callback, named } from './comp-utils';

export const Text = named(hoverable<TextProps>(props =>
    <span
        ref={props.ref}
        id={props.id}
        style={{
            wordBreak: 'break-word',
            background: props.background,
            ...(props.dropCaps && {
                float: 'left',
                fontSize: '400%',
                lineHeight: '80%',
            }),
            ...props.style,
        }}
    >
        {props.children}
    </span>
), 'Text');

export type LinkProps = LayoutProps & {
    to?: string,
    onClick?: Callback<void>, // TODO: rethinks this
};
export const Link = named(hoverable<LinkProps>(props =>
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
), 'Link');

export function showAlert(message: string) {
    alert(message);
}

// TODO: review and rethink this
// Make it 'RichText.<something>' ?

import * as React from 'react';

import { Color } from '../model';

import { Props, Callback } from './common';
import { RefHandler } from './Scroll';
import { isOpenNewTabEvent } from './utils';

export type TextSpanStyle = {
    color?: string,
    fontSize?: number,
    fontFamily?: string,
    fontStyle?: 'italic' | 'normal',
    fontWeight?: 'bold' | 'normal',
    textIndent?: string | number,
    display?: 'block',
};
export type TextSpanProps = {
    // TODO: extract ?
    style?: TextSpanStyle,
    background?: Color,
    dropCaps?: boolean,
    refHandler?: RefHandler,
    id?: string,
};
export function TextSpan(props: Props<TextSpanProps>) {
    return <span
        ref={props.refHandler}
        id={props.id}
        style={{
            ...props.style,
            wordBreak: 'break-word',
            background: props.background,
            ...(props.dropCaps && {
                float: 'left',
                fontSize: '400%',
                lineHeight: '80%',
            }),
        }}
    >
        {props.children}
    </span>;
}

export type TextLinkProps = {
    href?: string,
    onClick?: Callback<void>,
};
export function TextLink({ href: to, onClick, children }: Props<TextLinkProps>) {
    return <a
        href={to}
        style={{
            textDecoration: 'none',
            cursor: 'pointer',
        }}
        onClick={e => {
            e.stopPropagation();
            if (!isOpenNewTabEvent(e)) {
                e.preventDefault();
                if (onClick) {
                    onClick();
                }
            }
        }}
    >
        {children}
    </a>;
}

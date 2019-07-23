// TODO: review and rethink this
// Make it 'RichText.<something>' ?

import * as React from 'react';

import { Color } from '../model';

import { Props, Callback } from './common';
import { RefHandler } from './Scroll';
import { Hyperlink } from './Web';

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
    color?: string,
    hoverColor?: string,
    href?: string,
    onClick?: Callback<void>,
};
export function TextLink({ color, hoverColor, href, onClick, children }: Props<TextLinkProps>) {
    return <Hyperlink
        href={href}
        style={{
            color: color,
            ':hover': {
                color: hoverColor,
                textDecoration: 'solid',
            },
        }}
        onClick={onClick}
    >
        {children}
    </Hyperlink>;
}

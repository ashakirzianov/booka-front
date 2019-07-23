import * as React from 'react';

import { Props, Callback, point } from './common';
import { Hyperlink } from './Web';

type Color = string;
export type RichTextStyle = {
    color?: Color,
    hoverColor?: Color,
    background?: Color,
    fontSize?: number,
    fontFamily?: string,
    dropCaps?: boolean,
    italic?: boolean,
    bold?: boolean,
    line?: boolean,
    id?: string,
    refHandler?: (ref: any) => void,
    superLink?: TextLinkProps,
};
export function RichTextSpan(props: Props<RichTextStyle>) {
    return <span
        ref={props.refHandler}
        id={props.id}
        style={{
            wordBreak: 'break-word',
            color: props.color,
            background: props.background,
            fontSize: props.fontSize,
            fontFamily: props.fontFamily,
            fontStyle: props.italic ? 'italic' : undefined,
            fontWeight: props.bold ? 'bold' : undefined,
            ...(props.line && {
                textIndent: point(2),
                display: 'block',
            }),
            ...(props.dropCaps && {
                float: 'left',
                fontSize: props.fontSize
                    ? props.fontSize * 4
                    : '400%',
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

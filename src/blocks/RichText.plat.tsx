import * as React from 'react';

import { Callback } from '../utils';
import { WithChildren, point } from './common';
import { Hyperlink } from './Web';

type Color = string;
type SuperLink = {
    href?: string,
    onClick?: Callback<void>,
};
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
    superLink?: SuperLink,
};
export type RichTextSpanProps = WithChildren<{
    style: RichTextStyle,
}>;
export function RichTextSpan({ style, children }: RichTextSpanProps) {
    return <span
        ref={style.refHandler}
        id={style.id}
        style={{
            wordBreak: 'break-word',
            color: style.color,
            background: style.background,
            fontSize: style.fontSize,
            fontFamily: style.fontFamily,
            fontStyle: style.italic ? 'italic' : undefined,
            fontWeight: style.bold ? 'bold' : undefined,
            ...(style.line && {
                textIndent: point(2),
                display: 'block',
            }),
            ...(style.dropCaps && {
                float: 'left',
                fontSize: style.fontSize
                    ? style.fontSize * 4
                    : '400%',
                lineHeight: '80%',
            }),
        }}
    >
        {children}
    </span>;
}

export type TextLinkProps = WithChildren<SuperLink & {
    color?: string,
    hoverColor?: string,
}>;
export function TextLink({ color, hoverColor, href, onClick, children }: TextLinkProps) {
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

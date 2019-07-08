import * as React from 'react';
import { TextProps, LinkProps } from './Atoms.common';
import { isOpenNewTabEvent, hoverable } from './utils';
import { Props } from './common';

export { Row, Column } from './Atoms.common';

export function Text(props: Props<TextProps>) {
    return <span
        ref={props.refHandler}
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
    </span>;
}

function linkOrButton({ to, style, onClick, children }: Props<LinkProps>) {
    return <a
        href={to}
        style={{
            ...style,
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

export const Link = linkOrButton;
export const Button = linkOrButton;

export type HoverableTextProps = {
    color?: string,
    hoverColor?: string,
};
export const HoverableText = hoverable<HoverableTextProps>(function HoverableTextC({ color, hoverColor, children }) {
    return <span
        style={{
            color: color,
            ':hover': {
                color: hoverColor,
            },
        }}
    >
        {children}
    </span>;
});

export function Scroll(props: Props) {
    return <>{props.children}</>;
}

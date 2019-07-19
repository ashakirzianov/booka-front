import * as React from 'react';
import { TextProps, LinkProps, ScrollProps, HoverableContainerProps } from './Basic.common';
import { isOpenNewTabEvent, hoverable } from './utils';
import { Props } from './common';

export { Row, Column } from './Basic.common';

export function Text(props: Props<TextProps>) {
    return <span
        ref={props.refHandler}
        id={props.id}
        style={{
            wordBreak: 'break-word',
            background: props.background,
            ...props.style,
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

function HoverableContainerC(props: Props<HoverableContainerProps>) {
    return <div style={{
        display: 'flex',
        color: props.color,
        ...props.style,
        ...(props.hoverColor && {
            ':hover': {
                color: props.hoverColor,
            },
        }),
    }}>
        {props.children}
    </div>;
}
export const HoverableContainer = hoverable(HoverableContainerC);

function LinkOrButton({ to, style, onClick, children }: Props<LinkProps>) {
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

export const Link = LinkOrButton;
export const Button = LinkOrButton;

export function Scroll(props: Props<ScrollProps>) {
    return <>
        {props.children}
    </>;
}

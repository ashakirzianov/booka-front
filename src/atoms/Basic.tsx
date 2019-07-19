import * as React from 'react';
import { TextProps, LinkProps, ScrollProps } from './Basic.common';
import { isOpenNewTabEvent, hoverable } from './utils';
import { Props } from './common';
import { View } from 'react-native';

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

export type HoverableProps = {
    color?: string,
};
function HoverableC(props: Props<HoverableProps>) {
    return <div style={{
        display: 'flex',
        alignSelf: 'stretch',
        ...(props.color && {
            ':hover': {
                color: props.color,
            },
        }),
    } as any}>
        {props.children}
    </div>;
}
export const Hoverable = hoverable(HoverableC);

export const HoverableView = hoverable(View);

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

// TODO: remove
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

export function Scroll(props: Props<ScrollProps>) {
    return <>
        {props.children}
    </>;
}

import * as React from 'react';
import { TextProps, LinkProps } from './Atoms.common';
import { isOpenNewTabEvent, hoverable } from './utils';
import { Props, colors, themed, Themeable } from './common';

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

export function Link(props: Props<LinkProps>) {
    return <a
        href={props.to}
        style={{
            ...props.style,
            textDecoration: 'none',
            cursor: 'pointer',
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
    </a>;
}

export const Hoverable = themed(hoverable<Themeable>(function HoverableC(props) {
    return <span
        style={{
            fontSize: props.theme.fontSizes.normal,
            fontFamily: props.theme.fontFamilies.main,
            color: colors(props).accent,
            ':hover': {
                color: colors(props).highlight,
            },
        } as any} // TODO: remove 'as any'?
    >
        {props.children}
    </span>;
}));

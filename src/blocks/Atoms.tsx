import * as React from 'react';
import { TextProps, LinkProps } from './Atoms.common';
import { isOpenNewTabEvent } from './comp-utils.platform';
import { Props } from './comp-utils';

export { Row, Column } from './Atoms.common';

export function Text(props: Props<TextProps>) {
    return <span
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
    </span>;
}

export function Link(props: Props<LinkProps>) {
    return <a
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
    </a>;
}

import * as React from 'react';

import Radium from 'radium';
import { Callback, WithChildren } from './common';

export type HyperlinkProps = {
    style?: React.CSSProperties,
    href?: string,
    onClick?: Callback<void>,
};
function HyperlinkC(props: WithChildren<HyperlinkProps>) {
    return <a
        href={props.href}
        style={{
            textDecoration: 'none',
            cursor: 'pointer',
            ...props.style,
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
export const Hyperlink = hoverable(HyperlinkC);

type HoverableProps<T> = T extends { style?: infer S }
    ? T & { style?: S & { ':hover'?: S } }
    : T;
function hoverable<T>(Cmp: React.ComponentType<T>): React.ComponentType<HoverableProps<T>> {
    const result = Radium(Cmp);
    result.displayName = (Cmp.displayName || (Cmp as any).name);

    return result as any;
}

function isOpenNewTabEvent(e: React.MouseEvent) {
    return isMacOs()
        ? e.metaKey
        : e.ctrlKey;
}

function isMacOs(): boolean {
    return navigator.platform.startsWith('Mac');
}

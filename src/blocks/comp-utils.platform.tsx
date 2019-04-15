import * as React from 'react';
import { named } from './comp-utils';

export function isOpenNewTabEvent(e: React.MouseEvent) {
    return isMacOs()
        ? e.metaKey
        : e.ctrlKey;
}

function isMacOs(): boolean {
    return navigator.platform.startsWith('Mac');
}

export type RefType = HTMLElement | null;
export type RefHandler = (ref: RefType) => void;
export function refable<P = {}>(C: React.ComponentType<P>, name: string) {
    return named(React.forwardRef<HTMLDivElement, P & { children?: React.ReactNode }>((props, ref) =>
        <div ref={ref} style={{ display: 'flex' }}>
            <C {...props} />
        </div>
    ), name);
}

export const Refable = refable(props => <>{props.children}</>, 'Refable');

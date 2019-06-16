import * as React from 'react';
import { named } from './comp-utils';
import Radium from 'radium';

export function hoverable<T>(Cmp: React.ComponentType<T>): React.ComponentType<T> {
    return Radium(Cmp);
}

export function isOpenNewTabEvent(e: React.MouseEvent) {
    return isMacOs()
        ? e.metaKey
        : e.ctrlKey;
}

function isMacOs(): boolean {
    return navigator.platform.startsWith('Mac');
}

export function refable<P = {}>(C: React.ComponentType<P>, name: string) {
    return named(React.forwardRef<HTMLDivElement, P & { children?: React.ReactNode }>((props, ref) =>
        <div ref={ref} style={{ display: 'flex' }}>
            <C {...props} />
        </div>
    ), name);
}

export const Refable = refable(props => <>{props.children}</>, 'Refable');

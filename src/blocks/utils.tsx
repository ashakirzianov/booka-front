import * as React from 'react';

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

export function refable<P = {}>(C: React.ComponentType<P>) {
    return React.forwardRef<HTMLDivElement, P & { children?: React.ReactNode }>((props, ref) =>
        <div ref={ref} style={{ display: 'flex' }}>
            <C {...props} />
        </div>
    );
}

export const Refable = refable(props => <>{props.children}</>);

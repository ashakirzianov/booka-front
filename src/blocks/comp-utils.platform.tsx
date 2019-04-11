import * as React from 'react';

export function isOpenNewTabEvent(e: React.MouseEvent) {
    return isMacOs()
        ? e.metaKey
        : e.ctrlKey;
}

function isMacOs(): boolean {
    return navigator.platform.startsWith('Mac');
}

export type RefType = HTMLDivElement | null;
export type RefHandler = (ref: RefType) => void;
export function refable<P = {}>(C: React.ComponentType<P>) {
    return React.forwardRef<HTMLDivElement, P & { children?: React.ReactNode }>((props, ref) =>
        <div ref={ref} style={{ display: 'flex' }}>
            <C {...props} />
        </div>
    );
}

export const Refable = refable(props => <>{props.children}</>);

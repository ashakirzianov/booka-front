import * as React from 'react';

export function isOpenNewTabEvent(e: React.MouseEvent) {
    return false;
}

export function hoverable<T>(Cmp: React.ComponentType<T>): React.ComponentType<T> {
    return Cmp;
}

export function refable<P = {}>(C: React.ComponentType<P>) {
    return C;
}

export const Refable = refable(props => <>{props.children}</>);

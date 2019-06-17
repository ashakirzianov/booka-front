import * as React from 'react';
import { named } from './comp-utils';

export function isOpenNewTabEvent(e: React.MouseEvent) {
    return false;
}

export function hoverable<T>(Cmp: React.ComponentType<T>): React.ComponentType<T> {
    return Cmp;
}

export function refable<P = {}>(C: React.ComponentType<P>, name: string) {
    return named(C, name);
}

export const Refable = refable(props => <>{props.children}</>, 'Refable');

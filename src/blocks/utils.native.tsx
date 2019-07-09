import * as React from 'react';
import { View } from 'react-native';

export function isOpenNewTabEvent(e: React.MouseEvent) {
    return false;
}

export function hoverable<T>(Cmp: React.ComponentType<T>): React.ComponentType<T> {
    return Cmp;
}

// TODO: implement refability
export function refable<P = {}>(C: React.ComponentType<P>) {
    return React.forwardRef<HTMLDivElement, P & { children?: React.ReactNode }>((props, ref) =>
        <View style={{ display: 'flex' }}>
            <C {...props} />
        </View>
    );
}

export const Refable = refable(props => <>{props.children}</>);

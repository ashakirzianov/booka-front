import * as React from 'react';
import { Comp } from './comp-utils';

type Style = React.CSSProperties;
export const Text: Comp<{
    style: Style,
}, {
    onClick: any,
}> = props =>
    <span
        style={{
            cursor: 'pointer',
            ...props.style,
        }}
        onClick={props.onClick} // TODO: why do we need '!' here? investigate
    >
        {props.children}
    </span>;

export { View } from 'react-native';

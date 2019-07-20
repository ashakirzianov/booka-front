import * as React from 'react';
import { Props } from './common';
import { View, ViewStyle as NativeViewStyle } from 'react-native';

type ViewStyle = Pick<NativeViewStyle,
    | 'justifyContent' | 'width' | 'height'
    | 'alignItems' | 'alignSelf'
    | 'maxWidth' | 'maxHeight'
    | 'overflow' | 'margin' | 'padding'
    | 'backgroundColor'
    | 'borderRadius' | 'borderColor' | 'borderWidth'
    | 'flex' // TODO: do not allow ?
    | 'flexDirection'
> & {
    position?: NativeViewStyle['position'] | 'fixed',
};

export type LayoutProps = {
    style?: ViewStyle,
};

export function Column(props: Props<LayoutProps>) {
    return <View
        style={{
            ...convertLayoutStyle(props.style),
            flexDirection: 'column',
        }}
    >
        {props.children}
    </View>;
}

export function Row(props: Props<LayoutProps>) {
    return <View
        style={{
            ...convertLayoutStyle(props.style),
            flexDirection: 'row',
        }}
    >
        {props.children}
    </View>;
}

function convertLayoutStyle(style: LayoutProps['style']): NativeViewStyle | undefined {
    return style as ViewStyle;
}

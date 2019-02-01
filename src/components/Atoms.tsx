import * as React from 'react';
import { FlexStyle, View } from 'react-native';
import { Comp, size } from './comp-utils';

export { Text } from './Atoms.platform';
// export { View } from 'react-native';

export type Align = FlexStyle['alignItems'];
export type JustifyContent = 'center' | 'flex-start';
export type WidthHeight = string;
export const Column: Comp<{
    maxWidth?: number,
    margin?: number,
    align?: Align,
    backgroundColor?: string,
}> = props =>
        <View style={{
            flexDirection: 'column',
            maxWidth: size(props.maxWidth),
            alignItems: props.align,
            backgroundColor: props.backgroundColor,
            margin: size(props.margin),
        }}>
            {props.children}
        </View>;

export const Row: Comp<{
    style?: {
        justifyContent?: JustifyContent,
        width?: WidthHeight,
    },
}> = props =>
    <View style={{ ...props.style, flexDirection: 'row' }}>{props.children}</View>;

export const Screen: Comp<{
        color?: string,
    }> = props =>
            <View style={{
                position: 'absolute',
                minHeight: '100%',
                minWidth: '100%',
                backgroundColor: props.color,
            }}>
                {props.children}
            </View>

import * as React from 'react';
import { FlexStyle, View } from 'react-native';
import { Comp, size } from './comp-utils';
import { platformValue } from '../platform';

export { Text, showAlert } from './Atoms.platform';
export { SafeAreaView } from 'react-native';

export type TextCallbacks = {
    onClick: void,
};
export type TextProps = {
    style?: {
        fontWeight?: 'normal' | 'bold' | number,
        fontFamily?: string,
        fontSize?: number,
        textAlign?: 'justify',
        color?: string,
        cursor?: 'pointer',
    },
};

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

export const ScreenLayout: Comp<{
    color?: string,
}> = props =>
        <View style={{
            position: 'absolute',
            minHeight: '100%',
            minWidth: '100%',
            width: platformValue({ mobile: '100%' }),
            height: platformValue({ mobile: '100%' }),
            backgroundColor: props.color,
        }}>
            {props.children}
        </View>;

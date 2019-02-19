import * as React from 'react';
import { FlexStyle, View, ViewStyle } from 'react-native';
import { Comp, size } from './comp-utils';
import { platformValue } from '../platform';

export { Text, showAlert } from './Atoms.platform';
export { SafeAreaView, ScrollView } from 'react-native';

export type TextCallbacks = {
    onClick: any,
};
type FontWeight = 'normal' | 'bold' | number;
export type TextProps = {
    style?: {
        fontWeight?: FontWeight,
        fontFamily?: string,
        fontSize?: number,
        textAlign?: 'justify',
        color?: string,
        cursor?: 'pointer',
    },
};

export type Align = FlexStyle['alignItems'];
export type JustifyContent = FlexStyle['justifyContent'];
export type WidthHeight = string;
export type LayoutProps = {
    style?: {
        justifyContent?: JustifyContent,
        width?: WidthHeight,
        height?: WidthHeight,
        maxWidth?: number,
        maxHeight?: number,
        margin?: number,
        marginHorizontal?: number,
        align?: Align,
        backgroundColor?: string,
    }
};
function convertStyle(style: LayoutProps['style']): ViewStyle | undefined {
    return style && {
        width: style.width,
        height: style.height,
        maxWidth: size(style.maxWidth),
        maxHeight: size(style.maxHeight),
        alignItems: style.align,
        backgroundColor: style.backgroundColor,
        margin: size(style.margin),
        justifyContent: style.justifyContent,
        marginHorizontal: size(style.marginHorizontal),
    };
}
export const Column: Comp<LayoutProps> = props =>
    <View style={{ ...convertStyle(props.style), flexDirection: 'column' }}>{props.children}</View>;

export const Row: Comp<LayoutProps> = props =>
    <View style={{ ...convertStyle(props.style), flexDirection: 'row' }}>{props.children}</View>;

export const ScreenLayout: Comp<{
    color?: string,
}> = props => (
    <View style={{
        position: 'absolute',
        minHeight: '100%',
        minWidth: '100%',
        width: platformValue({ mobile: '100%' }),
        height: platformValue({ mobile: '100%' }),
        backgroundColor: props.color,
    }}>
        {props.children}
    </View>
);

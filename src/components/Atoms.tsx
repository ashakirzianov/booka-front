import * as React from 'react';
import { FlexStyle, View, ViewStyle } from 'react-native';
import { Comp, size } from './comp-utils';
import { platformValue } from '../platform';

export { Text, showAlert } from './Atoms.platform';
export { SafeAreaView, ScrollView } from 'react-native';

export type TextCallbacks = {
    onClick: any,
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
export type JustifyContent = FlexStyle['justifyContent'];
export type WidthHeight = string;
export type LayoutProps = {
    justifyContent?: JustifyContent,
    width?: WidthHeight,
    height?: WidthHeight,
    maxWidth?: number,
    maxHeight?: number,
    margin?: number,
    marginHorizontal?: number,
    align?: Align,
    backgroundColor?: string,
};
function styleFromProps(props: LayoutProps): ViewStyle {
    return {
        width: props.width,
        height: props.height,
        maxWidth: size(props.maxWidth),
        maxHeight: size(props.maxHeight),
        alignItems: props.align,
        backgroundColor: props.backgroundColor,
        margin: size(props.margin),
        justifyContent: props.justifyContent,
        marginHorizontal: size(props.marginHorizontal),
    };
}
export const Column: Comp<LayoutProps> = props =>
        <View style={{...styleFromProps(props), flexDirection: 'column'}}>{props.children}</View>;

export const Row: Comp<LayoutProps> = props =>
    <View style={{...styleFromProps(props), flexDirection: 'row'}}>{props.children}</View>;

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

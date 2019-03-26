import * as React from 'react';
import { FlexStyle, View, ViewStyle } from 'react-native';
import { Comp } from './comp-utils';
import { platformValue } from '../platform';

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
        fontStyle?: 'italic' | 'normal',
        textAlign?: 'justify',
        color?: string,
        cursor?: 'pointer',
        border?: string,
        margin?: string,
    },
};

export type Align = FlexStyle['alignItems'];
export type JustifyContent = FlexStyle['justifyContent'];
export type WidthHeight = string;
export type LayoutProps = {
    style?: ViewStyle | {
        position?: ViewStyle['position'] | 'fixed',
    },
};
function convertStyle(style: LayoutProps['style']): ViewStyle | undefined {
    return style as ViewStyle;
}
export const Column: Comp<LayoutProps> = props =>
    <View style={{ ...convertStyle(props.style), flexDirection: 'column' }}>
        {props.children}
    </View>;

export const Row: Comp<LayoutProps> = props =>
    <View
        style={{ ...convertStyle(props.style), flexDirection: 'row' }}
    >
        {props.children}
    </View>;

export const FullScreen: Comp<{
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

export const DottedLine: Comp = (props =>
    <View style={{
        flex: 1,
        borderBottom: 'dotted 0.2em',
    }} />
);

export {
    ClickResponder, Link, Tab, ModalBox, TopPanel, Div,
    Text, showAlert, NewLine,
} from './Atoms.platform';
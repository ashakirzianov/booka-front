import * as React from 'react';
import {
    Text as NativeText, Alert, TextStyle as NativeTextStyle, View,
} from 'react-native';
import { TextProps, AtomTextStyle, LayoutProps } from './Atoms';
import { Comp, Callback } from './comp-utils';

export const Text: Comp<TextProps> = (props =>
    <NativeText
        style={convertStyle(props.style)}
    >
        {props.children}
    </NativeText>
);

// TODO: implement
export type LinkProps = LayoutProps & {
    to?: string,
    onClick?: Callback<void>, // TODO: rethinks this
};
export const Link: Comp<LinkProps> = (props =>
    <View
        style={{
            ...props.style,
            alignSelf: 'flex-start' as any,
        } as any} // TODO: remove as any ?
        onTouchEnd={props.onClick}
    >
        {props.children}
    </View>
);

export function showAlert(message: string) {
    Alert.alert('Alert', message);
}

function convertStyle(style: AtomTextStyle | undefined): NativeTextStyle | undefined {
    // TODO: rethink this ?
    if (style && style[':hover'] !== undefined) {
        const styleCopy = { ...style };
        delete styleCopy[':hover'];
        return styleCopy as any;
    } else {
        return style;
    }
}

import * as React from 'react';
import {
    Text as NativeText, Alert, TextStyle as NativeTextStyle, View,
} from 'react-native';
import { TextProps, AtomTextStyle } from './Atoms';
import { Comp, Callback, Hoverable } from './comp-utils';

export const Text: Comp<TextProps> = (props =>
    <NativeText
        style={convertStyle(props.style)}
    >
        {props.children}
    </NativeText>
);

// TODO: implement
export type LinkProps = {
    to?: string,
    onClick?: Callback<void>, // TODO: rethinks this
    style?: Hoverable<AtomTextStyle>,
};
export const Link: Comp<LinkProps> = (props =>
    <View
    >
        {props.children}
    </View>
);

export function showAlert(message: string) {
    Alert.alert('Alert', message);
}

function convertStyle(style: AtomTextStyle | undefined): NativeTextStyle | undefined {
    return style;
}

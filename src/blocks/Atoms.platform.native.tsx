import * as React from 'react';
import {
    Text as NativeText, Alert, TextStyle as NativeTextStyle,
} from 'react-native';
import { TextProps, AtomTextStyle } from './Atoms';
import { Comp } from './comp-utils';

export const Text: Comp<TextProps> = (props =>
    <NativeText
        style={convertStyle(props.style)}
    >
        {props.children}
    </NativeText>
);

export function showAlert(message: string) {
    Alert.alert('Alert', message);
}

function convertStyle(style: AtomTextStyle | undefined): NativeTextStyle | undefined {
    return style;
}

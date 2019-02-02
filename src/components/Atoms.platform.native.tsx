import * as React from 'react';
import { Text as NativeText, Alert } from 'react-native';
import { TextProps, TextCallbacks } from './Atoms';
import { Comp } from './comp-utils';

export const Text: Comp<TextProps, TextCallbacks> = props =>
    <NativeText
        style={props.style && {
            fontWeight: props.style.fontWeight,
            fontFamily: props.style.fontWeight,
            fontSize: props.style.fontSize,
            textAlign: props.style.textAlign,
            color: props.style.color,
        }}
        onPress={props.onClick}
    >
        {props.children}
    </NativeText>;



export function showAlert(message: string) {
    Alert.alert('Alert', message);
}

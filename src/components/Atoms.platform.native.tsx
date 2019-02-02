import * as React from 'react';
import { Text as NativeText, Alert, TextStyle } from 'react-native';
import { TextProps, TextCallbacks } from './Atoms';
import { Comp } from './comp-utils';
import { Defined } from '../utils';

export const Text: Comp<TextProps, TextCallbacks> = props =>
    <NativeText
        style={props.style && {
            fontWeight: fontWeight(props.style.fontWeight),
            fontFamily: props.style.fontFamily,
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

function fontWeight(w: Defined<TextProps['style']>['fontWeight']): TextStyle['fontWeight'] {
    return w === undefined || typeof w === 'string' ? w :
        ( w <= 100 ? '100'
        : w <= 200 ? '200'
        : w <= 300 ? '300'
        : w <= 400 ? '400'
        : w <= 500 ? '500'
        : w <= 600 ? '600'
        : w <= 700 ? '700'
        : w <= 800 ? '800'
        : '900'
    );
}

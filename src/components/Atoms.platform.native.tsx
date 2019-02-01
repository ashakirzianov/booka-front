import * as React from 'react';
import { Text as NativeText } from 'react-native';
import { TextProps, TextCallbacks } from './Atoms';
import { Comp } from './comp-utils';

export const Text: Comp<TextProps, TextCallbacks> = props =>
    <NativeText
        style={{
            ...props.style,
        }}
        onPress={props.onClick}
    >
        {props.children}
    </NativeText>;

import * as React from 'react';
import {
    Text as NativeText, Alert, TextStyle as NativeTextStyle,
} from 'react-native';
import { TextProps, AtomTextStyle, LayoutProps } from './Atoms';
import { Comp, Callback, named } from './comp-utils';

export const Text: Comp<TextProps> = named((props =>
    <NativeText
        style={convertStyle(props.style)}
    >
        {props.children}
    </NativeText>
), 'Text');

// TODO: implement
export type LinkProps = LayoutProps & {
    to?: string,
    onClick?: Callback<void>, // TODO: rethinks this
};
export const Link: Comp<LinkProps> = named((props =>
    <NativeText
        style={{
            ...props.style,
            alignSelf: 'flex-start' as any,
        } as any} // TODO: remove as any ?
        onPress={props.onClick}
    >
        {props.children}
    </NativeText>
), 'Link');

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

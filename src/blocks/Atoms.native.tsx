import * as React from 'react';

import {
    Text as NativeText, TextStyle as NativeTextStyle,
    View, ViewStyle as NativeViewStyle,
} from 'react-native';
import { TextStyle, TextProps, LinkProps } from './Atoms.common';
import { Props } from './common';

export { Row, Column } from './Atoms.common';

export function Text(props: Props<TextProps>) {
    return <NativeText
        style={{
            backgroundColor: props.background,
            ...convertStyle(props.style),
        }}
    >
        {props.children}
    </NativeText>;
}

export function Link({ style, onClick, children }: Props<LinkProps>) {
    return <NativeText
        style={{
            ...style,
            alignSelf: 'flex-start' as any,
        } as any} // TODO: remove as any ?
        onPress={onClick}
    >
        {children}
    </NativeText>;
}

export function Button({ style, onClick, children }: Props<LinkProps>) {
    return <View
        style={{
            alignSelf: 'flex-start' as any,
            ...(style as NativeViewStyle),
        }}
        onTouchEnd={onClick}
    >
        {children}
    </View>;
}

export function Hoverable(props: Props) {
    return <>{props.children}</>;
}

function convertStyle(style: TextStyle | undefined): NativeTextStyle | undefined {
    // TODO: rethink this ?
    if (style && style[':hover'] !== undefined) {
        const styleCopy = { ...style };
        delete styleCopy[':hover'];
        return styleCopy as any;
    } else {
        return style;
    }
}

import * as React from 'react';
import {
    Text as NativeText, TextStyle as NativeTextStyle,
} from 'react-native';
import { TextStyle, TextProps, LinkProps } from './Atoms.common';
import { Props } from './comp-utils';

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

export function Link(props: Props<LinkProps>) {
    return <NativeText
        style={{
            ...props.style,
            alignSelf: 'flex-start' as any,
        } as any} // TODO: remove as any ?
        onPress={props.onClick}
    >
        {props.children}
    </NativeText>;
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

import * as React from 'react';

import { Text } from 'react-native';

import { Props, Callback } from './common';
import { RichTextStyle } from './RichText.plat';

export function TextSpan(props: Props<RichTextStyle>) {
    return <Text
        ref={props.refHandler}
        style={{
            color: props.color,
            backgroundColor: props.background,
            fontFamily: props.fontFamily,
            fontSize: props.fontSize,
            fontStyle: props.italic ? 'italic' : undefined,
            fontWeight: props.bold ? 'bold' : undefined,
        }}
    >
        {props.children}
    </Text>;
}

export type TextLinkProps = {
    href?: string,
    onClick?: Callback<void>,
};
export function TextLink({ onClick, children }: Props<TextLinkProps>) {
    return <Text
        onPress={onClick}
    >
        {children}
    </Text>;
}

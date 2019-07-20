// TODO: review and rethink this
// Make it 'RichText.<something>' ?

import * as React from 'react';

import { Text } from 'react-native';

import { Props, Callback } from './common';
import { TextSpanProps } from './Atoms';

export function TextSpan(props: Props<TextSpanProps>) {
    return <Text
        ref={props.refHandler}
        style={{
            ...(props.style && {
                fontFamily: props.style.fontFamily,
                fontSize: props.style.fontSize,
                fontWeight: props.style.fontWeight,
                fontStyle: props.style.fontStyle,
                color: props.style.color,
            }),
            backgroundColor: props.background,
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

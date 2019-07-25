import * as React from 'react';
import { Text } from 'react-native';

import { Callback } from '../utils';
import { WithChildren } from './common';
import { RichTextSpanProps } from './RichText.plat';

export function RichTextSpan({ style, children }: WithChildren<RichTextSpanProps>) {
    return <Text
        ref={style.refHandler}
        style={{
            color: style.color,
            backgroundColor: style.background,
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontStyle: style.italic ? 'italic' : undefined,
            fontWeight: style.bold ? 'bold' : undefined,
        }}
    >
        {children}
    </Text>;
}

export type TextLinkProps = {
    href?: string,
    onClick?: Callback<void>,
};
export function TextLink({ onClick, children }: WithChildren<TextLinkProps>) {
    return <Text
        onPress={onClick}
    >
        {children}
    </Text>;
}

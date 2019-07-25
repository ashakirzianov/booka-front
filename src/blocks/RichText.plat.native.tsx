import * as React from 'react';
import { Text } from 'react-native';

import { RichTextSpanProps, TextLinkProps } from './RichText.plat';

export function RichTextSpan({ style, children }: RichTextSpanProps) {
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

export function TextLink({ onClick, children }: TextLinkProps) {
    return <Text
        onPress={onClick}
    >
        {children}
    </Text>;
}

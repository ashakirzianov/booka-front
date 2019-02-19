import * as React from 'react';
import { Text, TextCallbacks } from './Atoms';
import { Comp } from './comp-utils';
import { TextProps } from './Atoms';

export const ActivityIndicator: Comp = props =>
    <Label text='Loading now...' />;

export const defaultStyle: TextProps['style'] = {
    fontFamily: 'Georgia',
    color: '#999999',
    fontSize: 26,
};

export const StyledText: Comp<TextProps, TextCallbacks> = props =>
    <Text
        {...props}
        style={{ ...defaultStyle, ...props.style }}
    >{props.children}</Text>

export const Label: Comp<{ text: string }> = props =>
    <StyledText>&nbsp;&nbsp;&nbsp;&nbsp;{props.text}</StyledText>;

export const ParagraphText: Comp<{ text: string }> = props =>
    <StyledText style={{
        textAlign: 'justify',
        foo: 'foo', // TODO: why excessive property check doesn't work here ?
    }}>&nbsp;&nbsp;&nbsp;&nbsp;{props.text}</StyledText>;

export const LinkButton: Comp<{
    text: string,
}, {
    onClick: void,
}> = props =>
        <StyledText
            style={{ cursor: 'pointer' }}
            onClick={props.onClick}
        >{props.text}</StyledText>;

export {
    Column, Row, FullScreen as ScreenLayout, ScrollView,
} from './Atoms';

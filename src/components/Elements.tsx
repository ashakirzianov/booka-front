import * as React from 'react';
import { Text as AtomText, TextCallbacks } from './Atoms';
import { Comp } from './comp-utils';
import { TextProps } from './Atoms';

export const ActivityIndicator: Comp = props =>
    <Label text='Loading now...' />;

export const fontSize = {
    normal: 26,
    subtitle: 30,
    title: 36,
};

export const defaultStyle: TextProps['style'] = {
    fontFamily: 'Georgia',
    color: '#999999',
    fontSize: fontSize.normal,
};

export const Text: Comp<TextProps, TextCallbacks> = props =>
    <AtomText
        {...props}
        style={{ ...defaultStyle, ...props.style }}
    >{props.children}</AtomText>

export const Label: Comp<{ text: string }> = props =>
    <Text>&nbsp;&nbsp;&nbsp;&nbsp;{props.text}</Text>;

export const ParagraphText: Comp<{ text: string }> = props =>
    <Text style={{
        textAlign: 'justify',
        foo: 'foo', // TODO: why excessive property check doesn't work here ?
    }}>&nbsp;&nbsp;&nbsp;&nbsp;{props.text}</Text>;

export const LinkButton: Comp<{
    text: string,
}, {
    onClick: void,
}> = props =>
        <Text
            style={{ cursor: 'pointer' }}
            onClick={props.onClick}
        >{props.text}</Text>;

export {
    Column, Row, Screen,
} from './Atoms';

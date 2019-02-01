import * as React from 'react';
import { Text, Row } from './Atoms';
import { Comp } from './comp-utils';
import { TextProps } from './Atoms';

export const ActivityIndicator: Comp = props =>
    <Label text='Loading now...' />;

const fontSize = {
    normal: 26,
    subtitle: 30,
    title: 36,
};

const defaultStyle: TextProps['style'] = {
    fontFamily: 'Georgia',
    color: '#999999',
    fontSize: fontSize.normal,
};

export const Label: Comp<{ text: string }> = props =>
    <Text style={{
        ...defaultStyle,
        foo: 'foo', // TODO: why excessive property check doesn't work here ?
    }}>&nbsp;&nbsp;&nbsp;&nbsp;{props.text}</Text>;

export const ParagraphText: Comp<{ text: string }> = props =>
    <Text style={{
        ...defaultStyle,
        textAlign: 'justify',
        foo: 'foo', // TODO: why excessive property check doesn't work here ?
    }}>&nbsp;&nbsp;&nbsp;&nbsp;{props.text}</Text>;

export const LinkButton: Comp<{
    text: string,
}, {
    onClick: void,
}> = props =>
        <Text style={{
            ...defaultStyle,
            cursor: 'pointer',
        }}
            onClick={props.onClick}
        >
            {props.text}
        </Text>;

export const ChapterTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'center' }}>
        <Text style={{ ...defaultStyle }}>{props.text}</Text>
    </Row>;

export const PartTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'center' }}>
        <Text style={{ ...defaultStyle, fontWeight: 'bold', fontSize: fontSize.subtitle }}>{props.text}</Text>
    </Row>;

export const SubpartTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'flex-start' }}>
        <Text style={{ ...defaultStyle, fontWeight: 'bold' }}>{props.text}</Text>
    </Row>;

export const BookTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'center', width: '100%' }}>
        <Text style={{ ...defaultStyle, fontWeight: 'bold', fontSize: fontSize.title }}>{props.text}</Text>
    </Row>;

export {
    Text, Column, Row, Screen,
} from './Atoms';

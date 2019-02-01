import * as React from 'react';
import { Text, Row } from './Atoms';
import { Comp } from './comp-utils';
import { TextProps } from './Atoms.common';

export const ActivityIndicator: Comp = props =>
    <TextBlock text='Loading now...' />;

const defaultStyle: TextProps['style'] = {
    fontFamily: 'Georgia',
    color: '#999999',
};
const fontSize = {
    normal: 26,
    subtitle: 30,
    title: 36,
};

export const TextBlock: Comp<{ text: string }> = props =>
    <Text style={{
        ...defaultStyle,
        fontSize: fontSize.normal,
        textAlign: 'justify',
        foo: 'foo', // TODO: why excessive property check doesn't work here ?
    }}>&nbsp;&nbsp;&nbsp;&nbsp;{props.text}</Text>;

export const LinkButton: Comp<{
    text: string,
}, {
    onClick: undefined,
}> = props =>
        <Text style={{
            ...defaultStyle,
        }}
            onClick={props.onClick}
        >
            {props.text}
        </Text>;

export const ChapterTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'center' }}>
        <Text style={{ ...defaultStyle, fontSize: fontSize.normal }}>{props.text}</Text>
    </Row>;

export const PartTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'center' }}>
        <Text style={{ ...defaultStyle, fontWeight: 'bold', fontSize: fontSize.subtitle }}>{props.text}</Text>
    </Row>;

export const SubpartTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'flex-start' }}>
        <Text style={{ ...defaultStyle, fontWeight: 'bold', fontSize: fontSize.normal }}>{props.text}</Text>
    </Row>;

export const BookTitle: Comp<{ text?: string }> = props =>
    <Row style={{ justifyContent: 'center', width: '100%' }}>
        <Text style={{ ...defaultStyle, fontWeight: 'bold', fontSize: fontSize.title }}>{props.text}</Text>
    </Row>;

export {
    Text, Column, Row, Screen,
} from './Atoms';

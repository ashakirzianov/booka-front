import * as React from 'react';
import {
    Text as NativeText, TextStyle as NativeTextStyle,
} from 'react-native';
import { Atoms, TextStyle, Column, Row } from './Atoms.common';

const atoms: Atoms = {
    Row, Column,
    Text: (props =>
        <NativeText
            style={{
                backgroundColor: props.background,
                ...convertStyle(props.style),
            }}
        >
            {props.children}
        </NativeText>
    ),
    Link: (props =>
        <NativeText
            style={{
                ...props.style,
                alignSelf: 'flex-start' as any,
            } as any} // TODO: remove as any ?
            onPress={props.onClick}
        >
            {props.children}
        </NativeText>
    ),
};

export default atoms;

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

import * as React from 'react';

import { Text, ActivityIndicator, TouchableWithoutFeedback, View, SafeAreaView } from 'react-native';

import { Themeable, colors, themed } from './connect';
import { TextLineProps, ClickableProps } from './Basics';
import { Column, Row } from './Layout';
import { defaults } from './defaults';
import { Props, point } from './common';
import { platformValue } from '../utils';

function TextLineC(props: Themeable<TextLineProps>) {
    const fontScale = props.fixedSize ? 1 : props.theme.fontScale;
    const fontSize = props.theme.fontSizes[props.size || 'normal'] * fontScale;
    const fontFamily = props.theme.fontFamilies[props.family || 'book'];
    return <Text
        style={{
            fontSize,
            fontFamily,
            color: props.color !== undefined ? colors(props)[props.color] : undefined,
            ...(props.style && {
                textAlign: props.style.textAlign,
                margin: props.style.margin,
            }),
        }}
    >
        {props.text}
    </Text>;
}
export const TextLine = themed(TextLineC);

function FullScreenActivityIndicatorC(props: Themeable) {
    return <Column style={{
        position: 'fixed' as any,
        top: 0, left: 0,
        minHeight: '100%',
        minWidth: '100%',
        width: '100%',
        height: '100%',
        backgroundColor: defaults.semiTransparent,
        justifyContent: 'center',
        zIndex: 10,
    }}>
        <ActivityIndicator
            size='large'
            color={colors(props).primary}
        />
    </Column>;
}
export const FullScreenActivityIndicator = themed(FullScreenActivityIndicatorC);

export function Separator() {
    return null;
}

// TODO: remove ?
export function Line(props: Props) {
    return <Row style={{
        width: '100%',
        justifyContent: 'space-between',
    }}>
        {props.children}
    </Row>;
}

// TODO: remove ?
export function Clickable(props: Props<ClickableProps>) {
    return <TouchableWithoutFeedback
        onPress={props.onClick}
    >
        <View>
            {props.children}
        </View>
    </TouchableWithoutFeedback>;
}

// TODO: remove ?
export function Tab() {
    return null;
}

// TODO: remove ?
function LayerC(props: Props<Themeable>) {
    return <Column style={{
        position: 'absolute',
        minHeight: '100%',
        minWidth: '100%',
        width: platformValue({ mobile: '100%' }),
        height: platformValue({ mobile: '100%' }),
        backgroundColor: colors(props).primary,
    }}>
        {props.children}
    </Column>;
}
export const Layer = themed(LayerC);

export function EmptyLine() {
    return <SafeAreaView>
        <Row
            style={{
                height: point(defaults.headerHeight),
            }}
        />
    </SafeAreaView>;
}

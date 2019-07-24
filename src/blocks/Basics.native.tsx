import * as React from 'react';

import {
    Text, ActivityIndicator, TouchableWithoutFeedback,
    View, SafeAreaView,
} from 'react-native';

import { Props, point, defaults } from './common';
import { Themeable, themed } from './connect';
import { TextLineProps, ClickableProps, PphProps } from './Basics';
import { platformValue } from '../utils';
import { colors, fontSize } from '../model';

function TextLineC(props: Themeable<TextLineProps>) {
    return <Text
        style={{
            fontFamily: props.theme.fontFamilies[props.family || 'book'],
            fontSize: fontSize(props.theme, props.size),
            color: props.color !== undefined ? colors(props.theme)[props.color] : undefined,
            textAlign: props.textAlign,
            margin: props.margin,
        }}
    >
        {props.text}
    </Text>;
}
export const TextLine = themed(TextLineC);

function FullScreenActivityIndicatorC(props: Themeable) {
    return <View
        style={{
            top: 0, left: 0,
            minHeight: '100%',
            minWidth: '100%',
            width: '100%',
            height: '100%',
            backgroundColor: defaults.semiTransparent,
            justifyContent: 'center',
            zIndex: 10,
        }}
    >
        <ActivityIndicator
            size='large'
            color={colors(props.theme).primary}
        />
    </View>;
}
export const FullScreenActivityIndicator = themed(FullScreenActivityIndicatorC);

export function Separator() {
    return null;
}

// TODO: remove ?
export function Line(props: Props) {
    return <View
        style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
        }}
    >
        {props.children}
    </View>;
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
    return <View
        style={{
            position: 'absolute',
            minHeight: '100%',
            minWidth: '100%',
            width: platformValue({ mobile: '100%' }),
            height: platformValue({ mobile: '100%' }),
            backgroundColor: colors(props.theme).primary,
        }}>
        {props.children}
    </View>;
}
export const Layer = themed(LayerC);

export function EmptyLine() {
    return <SafeAreaView>
        <View
            style={{
                flexDirection: 'row',
                height: point(defaults.headerHeight),
            }}
        />
    </SafeAreaView>;
}

export function Pph({ children }: Props<PphProps>) {
    return <Text>{children}</Text>;
}

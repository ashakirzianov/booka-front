import * as React from 'react';
import {
    Text, ActivityIndicator, TouchableWithoutFeedback,
    View, SafeAreaView,
} from 'react-native';

import { platformValue } from '../utils';
import { colors, fontSize } from '../model';
import { WithChildren, point, defaults } from './common';
import { TextLineProps, ClickableProps, PphProps, FullScreenActivityIndicatorProps, LayerProps } from './Basics';

export function TextLine(props: TextLineProps) {
    return <Text
        style={{
            fontFamily: props.theme.fontFamilies[props.fontFamily || 'book'],
            fontSize: fontSize(props.theme, props.fontSize),
            color: props.color !== undefined ? colors(props.theme)[props.color] : undefined,

        }}
    >
        {props.text}
    </Text>;
}

export function FullScreenActivityIndicator(props: FullScreenActivityIndicatorProps) {
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

export function Separator() {
    return null;
}

// TODO: remove ?
export function Clickable(props: WithChildren<ClickableProps>) {
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
export function Layer(props: WithChildren<LayerProps>) {
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

export function Pph({ children }: WithChildren<PphProps>) {
    return <Text>{children}</Text>;
}

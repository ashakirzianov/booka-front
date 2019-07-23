import * as React from 'react';
import { Props, Size } from './common';
import { View, ViewStyle } from 'react-native';

export type LayoutProps = {
    aligned?: boolean,
    centered?: boolean,
    scroll?: boolean,
    // TODO: remove when 'Left/Center/Right' implemented ?
    absolutePosition?: {
        top?: number,
        bottom?: number,
        left?: number,
        right?: number,
    },
    fullWidth?: boolean,
    fullHeight?: boolean,
    width?: Size,
    height?: Size,
    maxWidth?: Size,
    margin?: Size,
    padding?: Size,
    borderColor?: string,
};

export function Column(props: Props<LayoutProps>) {
    return <View
        style={{
            ...buildStyle(props),
            flexDirection: 'column',
        }}
    >
        {props.children}
    </View>;
}

export function Row(props: Props<LayoutProps>) {
    return <View
        style={{
            ...buildStyle(props),
            flexDirection: 'row',
        }}
    >
        {props.children}
    </View>;
}

function buildStyle(props: LayoutProps): ViewStyle | undefined {
    return {
        alignItems: props.aligned ? 'center' : 'stretch',
        justifyContent: props.centered ? 'space-around' : 'flex-start',
        overflow: props.scroll ? 'scroll' : undefined,
        width: props.fullWidth ? '100%' : props.width,
        height: props.fullHeight ? '100%' : props.height,
        maxWidth: props.maxWidth,
        margin: props.margin,
        padding: props.padding,
        ...(props.absolutePosition && {
            position: 'absolute',
            ...props.absolutePosition,
        }),
        ...(props.borderColor && {
            borderColor: props.borderColor,
            borderStyle: 'solid',
            borderWidth: 1,
        }),
    };
}

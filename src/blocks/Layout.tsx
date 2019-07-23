import * as React from 'react';
import { Props, Size } from './common';
import { View, ViewStyle } from 'react-native';

export type LayoutProps = {
    aligned?: boolean,
    centered?: boolean,
    scroll?: boolean,
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

export type TriadProps = {
    left?: React.ReactNode,
    center?: React.ReactNode,
    right?: React.ReactNode,
    leftPadding?: number,
    rightPadding?: number,
};
export function Triad(props: TriadProps) {
    return <View style={{ flexDirection: 'row' }}>
        {
            !props.center ? null :
                <View
                    key='center'
                    style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {props.center}
                </View>
        }
        {
            !props.left ? null :
                <View
                    key='left'
                    style={{
                        height: '100%',
                        justifyContent: 'center',
                        position: 'absolute',
                        left: props.leftPadding || 0,
                        top: 0,
                    }}
                >
                    {props.left}
                </View>
        }
        {
            !props.right ? null :
                <View
                    key='right'
                    style={{
                        height: '100%',
                        justifyContent: 'center',
                        position: 'absolute',
                        right: props.rightPadding || 0,
                        top: 0,
                    }}
                >
                    {props.right}
                </View>
        }
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
        ...(props.borderColor && {
            borderColor: props.borderColor,
            borderStyle: 'solid',
            borderWidth: 1,
        }),
    };
}

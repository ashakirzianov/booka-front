import * as React from 'react';
import { WithChildren, Size } from './common';
import { View, ViewStyle } from 'react-native';

export type LayoutProps = WithChildren<{
    stretched?: boolean,
    justified?: boolean,
    centered?: boolean,
    fullWidth?: boolean,
    fullHeight?: boolean,
    width?: Size,
    height?: Size,
    maxWidth?: Size,
    margin?: Size,
    padding?: Size,
    borderColor?: string,
}>;

function buildStyle(props: LayoutProps): ViewStyle | undefined {
    return {
        alignSelf: props.stretched ? 'stretch' : undefined,
        flexGrow: props.stretched ? 1 : undefined,
        alignItems: props.centered ? 'center' : 'stretch',
        justifyContent: props.justified ? 'space-around'
            : props.centered ? 'center'
                : undefined,
        width: props.fullWidth ? '100%' : props.width,
        height: props.fullHeight ? '100%' : props.height,
        maxWidth: props.maxWidth,
        margin: props.margin,
        padding: props.padding,
        ...(props.borderColor && {
            borderColor: props.borderColor,
            borderStyle: 'solid',
            borderWidth: 2,
        }),
    };
}

export function Column(props: LayoutProps) {
    return <View
        style={{
            ...buildStyle(props),
            flexDirection: 'column',
        }}
    >
        {props.children}
    </View>;
}

export function Row(props: LayoutProps) {
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
};
export function Triad(props: TriadProps) {
    return <View
        style={{
            flexGrow: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            // alignSelf: 'stretch',
        }}
    >
        <View style={{
            flex: 1,
            flexBasis: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
        }}>
            {props.left}
        </View>
        <View style={{
            flex: 1,
            flexBasis: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {props.center}
        </View>
        <View style={{
            flex: 1,
            flexBasis: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
        }}>
            {props.right}
        </View>
    </View>;
}

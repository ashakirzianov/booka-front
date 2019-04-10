import * as React from 'react';
import { View, ViewStyle } from 'react-native';
import { comp } from './comp-utils';

export * from './Atoms.platform';

function convertStyle(style: LayoutProps['style']): ViewStyle | undefined {
    return style as ViewStyle;
}

export type AllowedViewStyle = Pick<ViewStyle,
    | 'justifyContent' | 'width' | 'height' | 'alignItems'
    | 'maxWidth' | 'overflow' | 'margin' | 'padding'
    | 'flex' // TODO: do not allow ?
> & {
    position?: ViewStyle['position'] | 'fixed',
};

export type LayoutProps = {
    style?: AllowedViewStyle,
};
export const Column = comp<LayoutProps>(props =>
    <View style={{ ...convertStyle(props.style), flexDirection: 'column' }}>
        {props.children}
    </View>,
);

export const Row = comp<LayoutProps>(props =>
    <View
        style={{ ...convertStyle(props.style), flexDirection: 'row' }}
    >
        {props.children}
    </View>,
);

// TODO: remove
export type TextPropsStyle = React.CSSProperties;
export type AllowedTextStyle = Pick<TextPropsStyle,
    | 'fontWeight' | 'fontStyle' | 'textAlign' | 'margin'
    | 'fontSize' | 'fontFamily' | 'color' // TODO: disallow ?
    | 'letterSpacing'
>;
export type TextProps = {
    style?: AllowedTextStyle,
};

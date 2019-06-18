import * as React from 'react';

import { View, ViewStyle, TextStyle as NativeTextStyle } from 'react-native';
import { Comp, Hoverable, RefHandler, Callback } from './comp-utils';
import { Color } from '../model';

export type Atoms = {
    Text: Comp<TextProps>,
    Link: Comp<LinkProps>,
    Row: Comp<LayoutProps>,
    Column: Comp<LayoutProps>,
};

export type LinkProps = LayoutProps & {
    to?: string,
    onClick?: Callback<void>, // TODO: rethinks this
};

// TODO: remove
export type CssTextStyle = React.CSSProperties;
export type TextStyle = Hoverable<Pick<CssTextStyle,
    | 'fontStyle' | 'textAlign' | 'margin'
    | 'fontSize' | 'fontFamily' | 'color' // TODO: disallow ?
    | 'letterSpacing' | 'textIndent' | 'alignSelf'
> & Pick<NativeTextStyle,
    never
> & {
    fontWeight?: 'bold' | 'normal',
}>;

export type TextProps = {
    style?: TextStyle,
    background?: Color,
    dropCaps?: boolean,
    ref?: RefHandler,
    id?: string,
};

export type AllowedViewStyle = Pick<ViewStyle,
    | 'justifyContent' | 'width' | 'height'
    | 'alignItems' | 'alignSelf'
    | 'maxWidth' | 'overflow' | 'margin' | 'padding'
    | 'flex' // TODO: do not allow ?
> & {
    position?: ViewStyle['position'] | 'fixed',
};

export type LayoutProps = {
    style?: AllowedViewStyle,
};
export const Column: Comp<LayoutProps> = (props =>
    <View style={{ ...convertLayoutStyle(props.style), flexDirection: 'column' }}>
        {props.children}
    </View>
);

export const Row: Comp<LayoutProps> = (props =>
    <View
        style={{ ...convertLayoutStyle(props.style), flexDirection: 'row' }}
    >
        {props.children}
    </View>
);

function convertLayoutStyle(style: LayoutProps['style']): ViewStyle | undefined {
    return style as ViewStyle;
}

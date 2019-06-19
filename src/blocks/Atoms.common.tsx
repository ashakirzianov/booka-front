import * as React from 'react';

import { View, ViewStyle as NativeViewStyle, TextStyle as NativeTextStyle } from 'react-native';
import { Comp, Hoverable, Callback } from './common';
import { Color } from '../model';
import { RefHandler } from './Scroll';

export type LinkProps = LayoutProps & {
    to?: string,
    onClick?: Callback<void>, // TODO: rethinks this
};

type CssTextStyle = React.CSSProperties;
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
    refHandler?: RefHandler,
    id?: string,
};

export type ViewStyle = Pick<NativeViewStyle,
    | 'justifyContent' | 'width' | 'height'
    | 'alignItems' | 'alignSelf'
    | 'maxWidth' | 'overflow' | 'margin' | 'padding'
    | 'flex' // TODO: do not allow ?
> & {
    position?: NativeViewStyle['position'] | 'fixed',
};

export type LayoutProps = {
    style?: ViewStyle,
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

function convertLayoutStyle(style: LayoutProps['style']): NativeViewStyle | undefined {
    return style as ViewStyle;
}

import * as React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { Comp } from './comp-utils';
import * as Platform from './Atoms.platform';

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
export const Column: Comp<LayoutProps> = (props =>
    <View style={{ ...convertStyle(props.style), flexDirection: 'column' }}>
        {props.children}
    </View>
);

export const Row: Comp<LayoutProps> = (props =>
    <View
        style={{ ...convertStyle(props.style), flexDirection: 'row' }}
    >
        {props.children}
    </View>
);

// TODO: remove
export type CssTextStyle = React.CSSProperties;
export type AtomTextStyle = Pick<CssTextStyle,
    | 'fontStyle' | 'textAlign' | 'margin'
    | 'fontSize' | 'fontFamily' | 'color' // TODO: disallow ?
    | 'letterSpacing' | 'textIndent' | 'alignSelf'
> & Pick<TextStyle,
    never
> & {
    fontWeight?: 'bold' | 'normal',
};

export type TextProps = {
    style?: AtomTextStyle,
};

export type ActionLinkProps = Platform.ActionLinkProps;
export {
    ActionLink, Text,
} from './Atoms.platform';

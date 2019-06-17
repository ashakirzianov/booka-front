import * as React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { Comp, Callback, connectAll, Hoverable, RefHandler } from './comp-utils';
import { Action, actionToUrl } from '../core';
import { Link } from './Atoms.platform';

function convertStyle(style: LayoutProps['style']): ViewStyle | undefined {
    return style as ViewStyle;
}

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

export type ActionLinkProps = {
    action?: Action,
    onClick?: Callback<void>,
    style?: AllowedViewStyle,
};
export const ActionLink = connectAll<ActionLinkProps>(props =>
    <Link
        onClick={() => {
            if (props.action) {
                props.dispatch(props.action);
            }
            if (props.onClick) {
                props.onClick();
            }
        }}
        to={actionToUrl(props.action, props.state)}
        style={props.style}
    >
        {props.children}
    </Link>
);

// TODO: remove
export type CssTextStyle = React.CSSProperties;
export type AtomTextStyle = Hoverable<Pick<CssTextStyle,
    | 'fontStyle' | 'textAlign' | 'margin'
    | 'fontSize' | 'fontFamily' | 'color' // TODO: disallow ?
    | 'letterSpacing' | 'textIndent' | 'alignSelf'
    | 'background'
> & Pick<TextStyle,
    never
> & {
    fontWeight?: 'bold' | 'normal',
}>;

export type TextProps = {
    style?: AtomTextStyle,
    dropCaps?: boolean,
    ref?: RefHandler,
    id?: string,
};

export {
    Text,
} from './Atoms.platform';

import * as React from 'react';

import { Defined } from '../utils';
import { comp, VoidCallback, themed, Callback, relative } from './comp-utils';
import * as Atoms from './Atoms';
import { View } from 'react-native';
import { Theme } from '../model';
import { platformValue } from '../platform';

export * from './Elements.platform';

type TextStyle = Defined<Atoms.TextProps['style']>;
type AllowedTextStyleProps = Pick<TextStyle,
    | 'fontWeight' | 'fontStyle' | 'textAlign' | 'margin'
    | 'textAlign'
>;
type TextProps = {
    style?: AllowedTextStyleProps,
    size?: keyof Theme['fontSize'],
};
export const Text = themed<TextProps>(props =>
    <Atoms.Text style={{
        fontFamily: props.theme.fontFamily,
        fontSize: props.theme.fontSize[props.size || 'normal'],
        color: props.theme.color.foreground,
        ...props.style,
    }}>
        {props.children}
    </Atoms.Text>,
);

export type PseudoLinkProps = {
    to: string,
    action?: Callback<void>,
};

export const LinkButton = themed<PseudoLinkProps>(props =>
    <Atoms.Link {...props}>
        <View style={{
            border: 'solid',
            borderColor: props.theme.color.foreground,
            borderRadius: props.theme.radius,
            padding: relative(0.3), // TODO: extract somewhere ?
        }}>
            <Text>
                {props.children}
            </Text>
        </View>
    </Atoms.Link>,
);

export const DottedLine = themed(props =>
    <View style={{
        flex: 1,
        borderBottom: 'dotted 0.2em',
        color: props.theme.color.foreground,
    }} />,
);

// TODO: do we really need this ?
export const Label = comp<{ text: string, margin?: string }>(props =>
    <Text style={{ margin: props.margin }} size='normal'>
        {props.text}
    </Text>,
);

export const ActivityIndicator = comp(props =>
    <Label text='Loading now...' />,
);

export const PanelLink = comp<{
    to: string,
    action?: Callback<void>,
    text: string,
}>(props =>
    <Atoms.Link to={props.to}>
        <Text>{props.text}</Text>
    </Atoms.Link>,
);

export const PanelButton = comp<{
    text: string,
    onClick: VoidCallback,
}>(props =>
    <Atoms.Button onClick={props.onClick}>
        <Text>{props.text}</Text>
    </Atoms.Button>,
);

export const StretchLink = comp<{ to: string }>(props =>
    <View style={{ flex: 1 }}>
        <Atoms.Link to={props.to}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '0.3em',
            }}>
                {props.children}
            </div>
        </Atoms.Link>
    </View>,
);

export const FullScreen = themed(props =>
    <View style={{
        position: 'absolute',
        minHeight: '100%',
        minWidth: '100%',
        width: platformValue({ mobile: '100%' }),
        height: platformValue({ mobile: '100%' }),
        backgroundColor: props.theme.color.background,
    }}>
        {props.children}
    </View>,
);

export const TopPanel = comp(props =>
    <div style={{
        width: '100%',
        position: 'fixed',
        top: 0,
        zIndex: 5,
    }}>
        {props.children}
    </div>,
);

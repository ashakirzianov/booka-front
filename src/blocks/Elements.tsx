import * as React from 'react';

import { Defined } from '../utils';
import { comp, themed, relative } from './comp-utils';
import * as Atoms from './Atoms';
import { View } from 'react-native';
import { Theme } from '../model';
import { LinkProps } from './Atoms.platform';

export * from './Elements.platform';

type TextStyle = Defined<Atoms.TextProps['style']>;
type AllowedTextStyleProps = Pick<TextStyle,
    | 'fontWeight' | 'fontStyle' | 'textAlign' | 'margin'
    | 'textAlign'
>;
type TextProps = {
    style?: AllowedTextStyleProps,
    size?: keyof Theme['fontSize'],
    color?: keyof Theme['palette'],
    hoverColor?: keyof Theme['palette'],
};
export const Text = themed<TextProps>(props =>
    <Atoms.Text style={{
        fontFamily: props.theme.fontFamily,
        fontSize: props.theme.fontSize[props.size || 'normal'] * props.theme.fontScale,
        color: props.theme.palette[props.color || 'foreground'],
        ...(props.hoverColor && {
            [':hover']: {
                color: props.theme.palette[props.hoverColor],
            },
        }),
        ...props.style,
    }}>
        {props.children}
    </Atoms.Text>,
);

export const Label = comp<{ text: string, margin?: string }>(props =>
    <Text style={{ margin: props.margin }} size='normal'>
        {props.text}
    </Text>,
);

export const ActivityIndicator = comp(props =>
    <Label text='Loading now...' />,
);

export const PanelLink = themed<LinkProps & { text?: string }>(props =>
    <Atoms.Link to={props.to} action={props.action} style={{
        fontSize: props.theme.fontSize.normal,
        fontFamily: props.theme.fontFamily,
        color: props.theme.palette.accent,
        [':hover']: {
            color: props.theme.palette.highlight,
        },
        margin: relative(0.3),
    }}>
        {props.text}{props.children}
    </Atoms.Link>,
);

export const StretchLink = themed<{ to: string }>(props =>
    <View style={{ flex: 1 }}>
        <Atoms.Link to={props.to} style={{
            fontSize: props.theme.fontSize.normal,
            fontFamily: props.theme.fontFamily,
            color: props.theme.palette.accent,
            [':hover']: {
                color: props.theme.palette.highlight,
            },
            margin: relative(0.3),
        }}>
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

import * as React from 'react';

import { Defined } from '../utils';
import { comp, themed, relative } from './comp-utils';
import * as Atoms from './Atoms';
import { View } from 'react-native';
import { Theme } from '../model';
import { LinkProps } from './Atoms.platform';
import { IconName, Icon } from './Icons';

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

export const PanelLink = themed<LinkProps & { icon: IconName }>(props =>
    <Atoms.Link to={props.to} action={props.action} style={{
        fontSize: props.theme.fontSize.normal,
        fontFamily: props.theme.fontFamily,
        color: props.theme.palette.accent,
        [':hover']: {
            color: props.theme.palette.highlight,
        },
        margin: relative(0.5),
    }}>
        <Atoms.Column style={{ justifyContent: 'center' }}>
            <Icon name={props.icon} />{props.children}
        </Atoms.Column>
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

export const OverlayBox = themed(props =>
    <View style={{
        alignSelf: 'center',
        backgroundColor: props.theme.palette.secondBack,
        width: '100%',
        maxWidth: '50em',
        maxHeight: '100%',
        margin: '0 auto',
        zIndex: 10,
        borderRadius: props.theme.radius,
        boxShadow: `0px 0px 10px ${props.theme.palette.shadow}`,
    }}
    >
        {props.children}
    </View>,
);

export const Line = comp(props =>
    <Atoms.Row style={{
        width: '100%',
        justifyContent: 'space-between',
        padding: relative(1.5),

    }}>
        {props.children}
    </Atoms.Row>,
);

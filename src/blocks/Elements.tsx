import * as React from 'react';

import { Defined } from '../utils';
import { comp, themed, relative, palette } from './comp-utils';
import * as Atoms from './Atoms';
import { View } from 'react-native';
import { Theme, Palette } from '../model';
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
    color?: keyof Palette,
    hoverColor?: keyof Palette,
};
export const Text = themed<TextProps>(props =>
    <Atoms.Text style={{
        fontFamily: props.theme.fontFamily,
        fontSize: props.theme.fontSize[props.size || 'normal'] * props.theme.fontScale,
        color: palette(props)[props.color || 'text'],
        ...(props.hoverColor && {
            [':hover']: {
                color: palette(props)[props.hoverColor],
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
        color: palette(props).accent,
        [':hover']: {
            color: palette(props).highlight,
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
            color: palette(props).accent,
            [':hover']: {
                color: palette(props).highlight,
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
        backgroundColor: palette(props).secondary,
        width: '100%',
        maxWidth: '50em',
        maxHeight: '100%',
        margin: '0 auto',
        zIndex: 10,
        borderRadius: props.theme.radius,
        boxShadow: `0px 0px 10px ${palette(props).shadow}`,
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

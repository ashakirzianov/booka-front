import * as React from 'react';

import { comp, themed, relative, palette } from './comp-utils';
import * as Atoms from './Atoms';
import { View } from 'react-native';
import { Theme, Palette } from '../model';
import { IconName, Icon } from './Icons';

export * from './Elements.platform';

type TextProps = {
    style?: Atoms.AllowedTextStyle,
    size?: keyof Theme['fontSize'],
    color?: keyof Palette,
    hoverColor?: keyof Palette,
};
export const ThemedText = themed<TextProps>(props =>
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

export const PlainText = Atoms.Text;

export const Link = themed<Atoms.ActionLinkProps>(props =>
    <Atoms.ActionLink
        action={props.action}
        onClick={props.onClick}
        style={{
            ...props.style,
            fontSize: props.theme.fontSize.normal,
            fontFamily: props.theme.fontFamily,
            color: palette(props).accent,
            [':hover']: {
                color: palette(props).highlight,
            },
        }}
    >
        {props.children}
    </Atoms.ActionLink>,
);

export const Label = comp<{ text: string, margin?: string }>(props =>
    <ThemedText style={{ margin: props.margin }} size='normal'>
        {props.text}
    </ThemedText>,
);

export const PanelLink = comp<Atoms.ActionLinkProps & { icon: IconName }>(props =>
    <Link
        action={props.action}
        onClick={props.onClick}
        style={{ margin: relative(0.5) }}
    >
        <Atoms.Column style={{ justifyContent: 'center' }}>
            <Icon name={props.icon} />{props.children}
        </Atoms.Column>
    </Link>,
);

export const StretchLink = themed<Atoms.ActionLinkProps>(props =>
    <View style={{ flex: 1 }}>
        <Link action={props.action} style={{ margin: relative(0.5) }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '0.3em',
            }}>
                {props.children}
            </div>
        </Link>
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

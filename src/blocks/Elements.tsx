import * as React from 'react';

import { Comp, themed, relative, colors } from './comp-utils';
import * as Atoms from './Atoms';
import { View } from 'react-native';
import { Theme, Palette } from '../model';
import { IconName, Icon } from './Icons';

export * from './Elements.platform';

type TextProps = {
    style?: Atoms.AtomTextStyle,
    size?: keyof Theme['fontSize'],
    color?: keyof Palette['colors'],
    hoverColor?: keyof Palette['colors'],
};
export const ThemedText = themed<TextProps>(props =>
    <Atoms.Text style={{
        fontFamily: props.theme.fontFamily,
        fontSize: props.theme.fontSize[props.size || 'normal'] * props.theme.fontScale,
        color: colors(props)[props.color || 'text'],
        ...(props.hoverColor && {
            ':hover': {
                color: colors(props)[props.hoverColor],
            },
        }),
        ...props.style,
    }}>
        {props.children}
    </Atoms.Text>
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
            color: colors(props).accent,
            ':hover': {
                color: colors(props).highlight,
            },
        }}
    >
        {props.children}
    </Atoms.ActionLink>
);

export const Label: Comp<{ text: string, margin?: string }> = (props =>
    <ThemedText style={{ margin: props.margin }} size='normal'>
        {props.text}
    </ThemedText>
);

export type PanelLinkProps = Atoms.ActionLinkProps & { icon: IconName };
export const PanelLink: Comp<PanelLinkProps> = (props =>
    <Link
        action={props.action}
        onClick={props.onClick}
        style={{
            margin: relative(0.5),
        }}
    >
        <Atoms.Column style={{ justifyContent: 'center' }}>
            <Icon name={props.icon} />{props.children}
        </Atoms.Column>
    </Link>
);

export const StretchLink = themed<Atoms.ActionLinkProps>(props =>
    <View style={{ flex: 1 }}>
        <Link action={props.action} style={{
            margin: relative(0.5),
            alignSelf: 'stretch',
            ...props.style,
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '0.3em',
            }}>
                {props.children}
            </div>
        </Link>
    </View>
);

export const Line: Comp = (props =>
    <Atoms.Row style={{
        width: '100%',
        justifyContent: 'space-between',
    }}>
        {props.children}
    </Atoms.Row>
);

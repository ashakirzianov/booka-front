import * as React from 'react';

import { Comp, themed, relative, colors, Callback, connectAll } from './common';
import * as Atoms from './Atoms';
import { View, ActivityIndicator as NativeActivityIndicator } from 'react-native';
import { Theme, Palette, Color } from '../model';
import { IconName, Icon } from './Icons';
import { Action, actionToUrl } from '../core';
import { ViewStyle, TextStyle } from './Atoms.common';
import { defaults } from './defaults';
import { Hoverable } from './Atoms';

export type ActionLinkProps = {
    action?: Action,
    onClick?: Callback<void>,
    style?: ViewStyle,
};
export const ActionLink = connectAll<ActionLinkProps>(function ActionLinkC(props) {
    return <Atoms.Link
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
    </Atoms.Link>;
});

type ThemedTextProps = {
    style?: TextStyle,
    family?: keyof Theme['fontFamilies'],
    size?: keyof Theme['fontSizes'],
    fixedSize?: boolean,
    color?: keyof Palette['colors'],
    hoverColor?: keyof Palette['colors'],
};
export const ThemedText = themed<ThemedTextProps>(props => {
    const fontScale = props.fixedSize ? 1 : props.theme.fontScale;
    const fontSize = props.theme.fontSizes[props.size || 'normal'] * fontScale;
    const fontFamily = props.theme.fontFamilies[props.family || 'main'];
    return <Atoms.Text style={{
        textAlign: 'justify',
        fontSize,
        fontFamily,
        color: colors(props)[props.color || 'text'],
        ...(props.hoverColor && {
            ':hover': {
                color: colors(props)[props.hoverColor],
            },
        }),
        ...props.style,
    }}>
        {props.children}
    </Atoms.Text>;
});

export const PlainText = Atoms.Text;

export type TextLinkProps = ActionLinkProps;
export const ThemedTextLink = themed<TextLinkProps>(function TextLinkC(props) {
    return <ActionLink
        action={props.action}
        onClick={props.onClick}
        style={props.style}
    >
        <Hoverable>{props.children}</Hoverable>
    </ActionLink>;
});

export const Label: Comp<{ text: string, margin?: string }> = (props =>
    <ThemedText style={{ margin: props.margin }} size='normal'>
        {props.text}
    </ThemedText>
);

export type PanelLinkProps = ActionLinkProps & { icon: IconName };
export const PanelLink: Comp<PanelLinkProps> = (props =>
    <ActionLink
        action={props.action}
        onClick={props.onClick}
        style={{
            margin: relative(0.5),
        }}
    >
        <Hoverable>
            <Atoms.Column style={{ justifyContent: 'center' }}>
                <Icon name={props.icon} />{props.children}
            </Atoms.Column>
        </Hoverable>
    </ActionLink>
);

export const TagButton: Comp<{ color: Color }> = (props =>
    <View style={{
        justifyContent: 'center',
        backgroundColor: props.color,
        borderRadius: 50,
        padding: relative(0.2),
    }}>
        <Atoms.Row style={{ justifyContent: 'center' }}>
            {props.children}
        </Atoms.Row>
    </View>
);

export const StretchLink = themed<ActionLinkProps>(props =>
    <View style={{ flex: 1 }}>
        <ThemedTextLink action={props.action} style={{
            ...props.style,
            margin: relative(0.5),
            alignSelf: 'stretch',
        }}>
            <View style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '0.3em',
                flexDirection: 'row',
            }}>
                {props.children}
            </View>
        </ThemedTextLink>
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

export const ActivityIndicator = themed(props =>
    <NativeActivityIndicator
        size='large'
        color={colors(props).primary}
    />
);

export const FullScreenActivityIndicator: Comp = (props =>
    <View style={{
        position: 'fixed' as any,
        top: 0, left: 0,
        minHeight: '100%',
        minWidth: '100%',
        width: '100%',
        height: '100%',
        backgroundColor: defaults.semiTransparent,
        justifyContent: 'center',
        zIndex: 10,
    }}>
        <ActivityIndicator />
    </View>
);

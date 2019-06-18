import * as React from 'react';

import { Comp, themed, relative, colors, Callback, connectAll } from './comp-utils';
import Atoms from './Atoms';
import { View } from 'react-native';
import { Theme, Palette, Color } from '../model';
import { IconName, Icon } from './Icons';
import { Action, actionToUrl } from '../core';
import { AllowedViewStyle, TextStyle } from './Atoms.common';

export {
    Clickable, DottedLine, LinkButton, OverlayBox,
    Separator, Tab,
} from './Elements.platform';

export type ActionLinkProps = {
    action?: Action,
    onClick?: Callback<void>,
    style?: AllowedViewStyle,
};
export const ActionLink = connectAll<ActionLinkProps>(props =>
    <Atoms.Link
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
    </Atoms.Link>
);

type TextProps = {
    style?: TextStyle,
    family?: keyof Theme['fontFamilies'],
    size?: keyof Theme['fontSizes'],
    fixedSize?: boolean,
    color?: keyof Palette['colors'],
    hoverColor?: keyof Palette['colors'],
};
export const ThemedText = themed<TextProps>(props => {
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
export const TextLink = themed<TextLinkProps>(props =>
    <ActionLink
        action={props.action}
        onClick={props.onClick}
        style={props.style}
    >
        <Atoms.Text
            style={{
                fontSize: props.theme.fontSizes.normal,
                fontFamily: props.theme.fontFamilies.main,
                color: colors(props).accent,
                ':hover': {
                    color: colors(props).highlight,
                },
            } as any} // TODO: remove 'as any'?
        >
            {props.children}
        </Atoms.Text>
    </ActionLink>
);

export const Label: Comp<{ text: string, margin?: string }> = (props =>
    <ThemedText style={{ margin: props.margin }} size='normal'>
        {props.text}
    </ThemedText>
);

export type PanelLinkProps = ActionLinkProps & { icon: IconName };
export const PanelLink: Comp<PanelLinkProps> = (props =>
    <TextLink
        action={props.action}
        onClick={props.onClick}
        style={{
            margin: relative(0.5),
        }}
    >
        <Atoms.Column style={{ justifyContent: 'center' }}>
            <Icon name={props.icon} />{props.children}
        </Atoms.Column>
    </TextLink>
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
        <TextLink action={props.action} style={{
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
        </TextLink>
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

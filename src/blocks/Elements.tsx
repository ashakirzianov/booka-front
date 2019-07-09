import * as React from 'react';

import { Comp, themed, colors, Callback, connectAll, point, Props } from './common';
import * as Atoms from './Atoms';
import { LinkProps } from './Atoms.common';
import { View, ActivityIndicator as NativeActivityIndicator } from 'react-native';
import { Theme, Palette, Color } from '../model';
import { Icon } from './Icons';
import { IconName } from './Icons.common';
import { Action, actionToUrl } from '../core';
import { ViewStyle, TextStyle } from './Atoms.common';
import { defaults } from './defaults';

export type ActionableProps = {
    action?: Action,
    onClick?: Callback<void>,
    style?: ViewStyle,
};
function actionize(LinkOrButton: Comp<LinkProps>) {
    return connectAll<ActionableProps>(function ActionLinkC({ action, onClick, state, children, dispatch, style }) {
        return <LinkOrButton
            onClick={() => {
                if (action) {
                    dispatch(action);
                }
                if (onClick) {
                    onClick();
                }
            }}
            to={actionToUrl(action, state)}
            style={style}
        >
            {children}
        </LinkOrButton>;
    });
}
export const ActionLink = actionize(Atoms.Link);
export const ActionButton = actionize(Atoms.Button);

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

// TODO: remove this one
export const ThemedHoverable = themed(function HoverableC(props) {
    return <Atoms.HoverableText
        color={colors(props).accent}
        hoverColor={colors(props).highlight}
    >
        {props.children}
    </Atoms.HoverableText>;
});

export const Label: Comp<{ text: string, margin?: string }> = (props =>
    <ThemedText style={{ margin: props.margin }} size='normal'>
        {props.text}
    </ThemedText>
);

export type PanelLinkProps = ActionableProps & { icon: IconName };
export const PanelButton = themed<PanelLinkProps>(function PanelButtonC(props) {
    return <ActionButton
        action={props.action}
        onClick={props.onClick}
        style={{
            margin: point(0.5),
        }}
    >
        <Atoms.Column style={{ justifyContent: 'center' }}>
            <Icon
                name={props.icon}
                color={colors(props).accent}
                hover={colors(props).highlight}
                size={24}
            />
            {props.children}
        </Atoms.Column>
    </ActionButton>;
});

export type TagButtonProps = {
    color?: Color,
    borderColor?: Color,
};
export function TagButton(props: Props<TagButtonProps>) {
    return <View style={{
        justifyContent: 'center',
        backgroundColor: props.color,
        borderWidth: props.borderColor ? 1 : undefined,
        borderColor: props.borderColor,
        borderRadius: 50,
        paddingHorizontal: point(1),
        paddingVertical: point(0.2),
    }}>
        <Atoms.Row style={{ justifyContent: 'center' }}>
            {props.children}
        </Atoms.Row>
    </View>;
}

export const StretchLink = themed<ActionableProps>(function StretchLinkC({ action, style, children }) {
    return <View style={{ flex: 1 }}>
        <ActionButton action={action} style={{
            ...style,
            // margin: relative(0.5),
            alignSelf: 'stretch',
        }}>
            <View style={{
                display: 'flex',
                justifyContent: 'space-between',
                // margin: relative(0.3),
                flexDirection: 'row',
            }}>
                {children}
            </View>
        </ActionButton>
    </View>;
});

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

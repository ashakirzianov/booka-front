// TODO: rename file to 'Themed' ?
import * as React from 'react';

import { View, ActivityIndicator as NativeActivityIndicator } from 'react-native';
import { Theme, Palette, Color, PaletteColor } from '../model';
import { Action, actionToUrl } from '../core';
import { connectAll, themed, colors, Themeable } from './connect';
import {
    Comp, Callback, point, Props, Icon, hoverable,
} from '../atoms';

// TODO: remove all second-level imports
import { ViewStyle, LinkProps, TextStyle, Column, Row, LayoutProps } from '../atoms/Basic.common';
import { Button, Link, Text, HoverableContainer } from '../atoms/Basic';
import { IconName } from '../atoms/Icons.common';
import { defaults } from '../atoms/defaults';

export type ThemedContainerProps = LayoutProps & {
    hoverColor?: PaletteColor,
    color?: PaletteColor,
};
function ThemedContainerC(props: Props<Themeable<ThemedContainerProps>>) {
    return <HoverableContainer
        style={{
            ...props.style,
            color: props.color !== undefined
                ? colors(props)[props.color]
                : undefined,
            ...(props.hoverColor && {
                ':hover': {
                    color: colors(props)[props.hoverColor],
                },
            }),
        } as any} // TODO: remove 'as any' (color prop is a problem)
    >
        {props.children}
    </HoverableContainer>;
}
export const ThemedContainer = themed(hoverable(ThemedContainerC));

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
export const ActionLink = actionize(Link);
export const ActionButton = actionize(Button);

type TextLineProps = {
    text: string | undefined, // TODO: make optional ?
    style?: TextStyle,
    family?: keyof Theme['fontFamilies'],
    size?: keyof Theme['fontSizes'],
    fixedSize?: boolean,
    color?: keyof Palette['colors'],
    hoverColor?: keyof Palette['colors'],
};
function TextLineC(props: Themeable<TextLineProps>) {
    const fontScale = props.fixedSize ? 1 : props.theme.fontScale;
    const fontSize = props.theme.fontSizes[props.size || 'normal'] * fontScale;
    const fontFamily = props.theme.fontFamilies[props.family || 'book'];
    const textComp = <Text
        style={{
            fontSize,
            fontFamily,
            color: props.color !== undefined ? colors(props)[props.color] : undefined,
            ...props.style,
        }}
    >
        {props.text}
    </Text>;
    if (props.hoverColor) {
        return <HoverableContainer color={colors(props)[props.hoverColor]}>
            {textComp}
        </HoverableContainer>;
    } else {
        return textComp;
    }
}
export const TextLine = themed(TextLineC);

export type PanelLinkProps = ActionableProps & { icon: IconName };
export const PanelButton = themed<PanelLinkProps>(function PanelButtonC(props) {
    return <ActionButton
        action={props.action}
        onClick={props.onClick}
        style={{
            margin: point(0.5),
        }}
    >
        <Column style={{ justifyContent: 'center' }}>
            <Icon
                name={props.icon}
                color={colors(props).accent}
                hover={colors(props).highlight}
                size={24}
            />
            {props.children}
        </Column>
    </ActionButton>;
});

// TODO: move to atoms
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
        <Row style={{ justifyContent: 'center' }}>
            {props.children}
        </Row>
    </View>;
}

export function StretchLink({ action, style, children }: Props<ActionableProps>) {
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
}

export const Line: Comp = (props =>
    <Row style={{
        width: '100%',
        justifyContent: 'space-between',
    }}>
        {props.children}
    </Row>
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

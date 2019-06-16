import * as React from 'react';

import { Comp, themed, relative, colors } from './comp-utils';
import * as Atoms from './Atoms';
import { View } from 'react-native';
import { Theme, Palette, Color } from '../model';
import { IconName, Icon } from './Icons';

export {
    Clickable, DottedLine, LinkButton, OverlayBox,
    Separator, Tab,
} from './Elements.platform';

type TextProps = {
    style?: Atoms.AtomTextStyle,
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

export type TextLinkProps = Atoms.ActionLinkProps;
export const TextLink = themed<TextLinkProps>(props =>
    <Atoms.ActionLink
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
    </Atoms.ActionLink>
);

export const Label: Comp<{ text: string, margin?: string }> = (props =>
    <ThemedText style={{ margin: props.margin }} size='normal'>
        {props.text}
    </ThemedText>
);

export type PanelLinkProps = Atoms.ActionLinkProps & { icon: IconName };
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

export const StretchLink = themed<TextLinkProps>(props =>
    <View style={{ flex: 1 }}>
        <TextLink action={props.action} style={{
            ...props.style,
            margin: relative(0.5),
            alignSelf: 'stretch',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '0.3em',
            }}>
                {props.children}
            </div>
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

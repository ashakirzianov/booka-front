import * as React from 'react';

import { Text, View } from 'react-native';

import { TextLine } from './Basics';
import { point, Props } from './common';
import { Column, Row } from './Layout';
import { Icon } from './Icons';
import { connectAll } from './connect';
import { TextButtonProps, IconButtonProps, TagButtonProps, PaletteButtonProps, StretchTextButtonProps, ButtonProps } from './Buttons';
import { colors, fontSize } from '../model';

function TextButtonC(props: TextButtonProps) {
    return <Link {...props}>
        <TextLine
            text={props.text}
            family={props.family}
            size={props.size}
            style={props.style}
        />
    </Link>;
}
export const TextButton = connectAll(TextButtonC);

function IconButtonC(props: IconButtonProps) {
    return <Button
        {...props}
    >
        <Column style={{ justifyContent: 'center' }}>
            <Icon
                name={props.icon}
                color={colors(props.theme).accent}
                hoverColor={colors(props.theme).highlight}
                size={24}
            />
        </Column>
    </Button>;
}
export const IconButton = connectAll(IconButtonC);

function TagButtonC(props: TagButtonProps) {
    return <Button {...props}>
        <Column style={{
            justifyContent: 'center',
            backgroundColor: colors(props.theme).secondary,
            borderWidth: 1,
            borderColor: colors(props.theme).secondary,
            borderRadius: 50,
            paddingHorizontal: point(1),
            paddingVertical: point(0.2),
        }}>
            <Row style={{ justifyContent: 'center' }}>
                <TextLine
                    text={props.text}
                    size='smallest'
                    family='menu'
                    color='accent'
                />
            </Row>
        </Column>
    </Button>;
}
export const TagButton = connectAll(TagButtonC);

function BorderButtonC(props: TextButtonProps) {
    return <Button {...props}>
        <View style={{
            borderStyle: 'solid',
            borderColor: colors(props.theme).accent,
            color: colors(props.theme).accent,
            fontSize: fontSize(props.theme, 'normal'),
            borderRadius: 10,
            padding: point(0.3),
        }}>
            <TextLine
                text={props.text}
                family={props.family}
                size={props.size}
                style={props.style}
            />
        </View>
    </Button>;
}
export const BorderButton = connectAll(BorderButtonC);

function PaletteButtonC(props: PaletteButtonProps) {
    const theme = props.theme;
    const cols = theme.palettes[theme.currentPalette].colors;
    return <Button {...props}>
        <Column style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            backgroundColor: cols.primary,
            borderRadius: 50,
            borderColor: cols.highlight,
            borderWidth: props.palette === theme.currentPalette ? 3 : 0,
            shadowColor: cols.shadow,
            shadowRadius: 5,
        }}>
            <Row style={{ justifyContent: 'center' }}>
                <Text style={{
                    color: cols.text,
                    fontSize: fontSize(props.theme, 'normal'),
                }}>
                    {props.text}
                </Text>
            </Row>
        </Column>
    </Button>;
}
export const PaletteButton = connectAll(PaletteButtonC);

function StretchTextButtonC(props: StretchTextButtonProps) {
    return <Button {...props}>
        <View style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
        }}
        >
            {props.texts.map((t, idx) => <TextLine key={idx} text={t} />)}
        </View>
    </Button>;
}
export const StretchTextButton = connectAll(StretchTextButtonC);

// =================================================

function Link({ onClick, children }: Props<ButtonProps<{}>>) {
    return <Text
        onPress={onClick}
    >
        {children}
    </Text>;
}

function Button({ onClick, children }: Props<ButtonProps<{}>>) {
    return <View
        onTouchEnd={onClick}
    >
        {children}
    </View>;
}

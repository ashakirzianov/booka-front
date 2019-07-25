import * as React from 'react';
import { View } from 'react-native';

import { Callback } from '../utils';
import { PaletteName, colors, fontSize, Theme } from '../model';
import { TextLine, TextProps } from './Basics';
import { point, WithChildren } from './common';
import { Icon, IconName } from './Icons';
import { Hyperlink } from './Web';

export type SuperLink = {
    href?: string,
    onClick?: Callback<void>,
};
export type ButtonProps<T> = T & SuperLink & {
    theme: Theme,
};

export type TextButtonProps = ButtonProps<TextProps & {
    text: string,
}>;
export function TextButton(props: TextButtonProps) {
    return <Hyperlink
        href={props.href}
        onClick={props.onClick}
        style={{
            color: colors(props.theme).accent,
            ':hover': {
                color: colors(props.theme).highlight,
            },
        }}
    >
        <TextLine
            theme={props.theme}
            text={props.text}
            fontFamily={props.fontFamily}
            fontSize={props.fontSize}
            letterSpacing={props.letterSpacing}
        />
    </Hyperlink>;
}

export type IconButtonProps = ButtonProps<{
    icon: IconName,
}>;
export function IconButton(props: IconButtonProps) {
    return <Hyperlink
        href={props.href}
        onClick={props.onClick}
        style={{
            color: colors(props.theme).accent,
            ':hover': {
                color: colors(props.theme).highlight,
            },
        }}
    >
        <View>
            <Icon
                name={props.icon}
                size={24}
            />
        </View>
    </Hyperlink>;
}

export type TagButtonProps = ButtonProps<{
    text: string,
}>;
export function TagButton(props: TagButtonProps) {
    return <Hyperlink
        href={props.href}
        onClick={props.onClick}
        style={{
            color: colors(props.theme).secondary,
            backgroundColor: colors(props.theme).accent,
            borderWidth: 1,
            borderRadius: 50,
            ':hover': {
                backgroundColor: colors(props.theme).highlight,
            },
        }}
    >
        <View style={{
            flexDirection: 'column',
            justifyContent: 'center',
            paddingHorizontal: point(1),
            paddingVertical: point(0.2),
        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
            }}>
                <TextLine
                    theme={props.theme}
                    text={props.text}
                    fontSize='smallest'
                />
            </View>
        </View>
    </Hyperlink>;
}

export function BorderButton(props: TextButtonProps) {
    return <Hyperlink
        href={props.href}
        onClick={props.onClick}
        style={{
            color: colors(props.theme).accent,
            borderColor: colors(props.theme).accent,
            ':hover': {
                color: colors(props.theme).highlight,
                borderColor: colors(props.theme).highlight,
            },
        }}
    >
        <div
            style={{
                borderStyle: 'solid',
                fontSize: fontSize(props.theme, 'normal'),
                borderRadius: 10,
                padding: point(0.3),
            }}
        >
            <TextLine
                theme={props.theme}
                text={props.text}
                fontFamily={props.fontFamily}
                fontSize={props.fontSize}
                letterSpacing={props.letterSpacing}
            />
        </div>
    </Hyperlink>;
}

export type PaletteButtonProps = ButtonProps<{
    text: string,
    palette: PaletteName,
}>;
export function PaletteButton(props: PaletteButtonProps) {
    const theme = props.theme;
    const cols = theme.palettes[props.palette].colors;
    const selected = props.palette === theme.currentPalette;
    return <Hyperlink
        href={props.href}
        onClick={props.onClick}
        style={{
            color: cols.text,
            fontSize: fontSize(props.theme, 'normal'),
            ':hover': {
                color: cols.highlight,
            },
        }}
    >
        <View style={{
            flexDirection: 'column',
            width: 50,
            height: 50,
            justifyContent: 'center',
            backgroundColor: cols.primary,
            borderRadius: 50,
            borderColor: cols.highlight,
            borderWidth: selected ? 3 : 0,
            shadowColor: cols.shadow,
            shadowRadius: 5,
        }}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
            >
                <span>{props.text}</span>
            </View>
        </View>
    </Hyperlink>;
}

export type StretchTextButtonProps = ButtonProps<{}>;
export function StretchTextButton(props: WithChildren<StretchTextButtonProps>) {
    return <Hyperlink
        href={props.href}
        onClick={props.onClick}
        style={{
            alignSelf: 'stretch',
            flexGrow: 1,
            color: colors(props.theme).accent,
            borderColor: colors(props.theme).accent,
            ':hover': {
                color: colors(props.theme).highlight,
                borderColor: colors(props.theme).highlight,
            },
        }}
    >
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}>
            {props.children}
        </View>
    </Hyperlink>;
}

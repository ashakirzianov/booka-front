import * as React from 'react';

// TODO: review imports
import { PaletteName, colors, fontSize } from '../model';
import { TextLine, TextProps } from './Basics';
import { Callback, point } from './common';
import { Icon, IconName } from './Icons';
import { Themeable } from './connect';
import { Hyperlink } from './Web';
import { View } from 'react-native';

export type ButtonProps<T> = T & Themeable<{
    href?: string,
    onClick?: Callback<void>,
}>;

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
            text={props.text}
            family={props.family}
            size={props.size}
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
        <View style={{ justifyContent: 'center' }}>
            <Icon
                name={props.icon}
                color={colors(props.theme).accent}
                hoverColor={colors(props.theme).highlight}
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
                    text={props.text}
                    size='smallest'
                    family='menu'
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
                text={props.text}
                family={props.family}
                size={props.size}
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

export type StretchTextButtonProps = ButtonProps<{
    texts: string[],
}>;
export function StretchTextButton(props: StretchTextButtonProps) {
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
        <div style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
        }}
        >
            {props.texts.map((t, idx) => <TextLine key={idx} text={t} />)}
        </div>
    </Hyperlink>;
}

import * as React from 'react';

import { Text, View } from 'react-native';

import { TextLine } from './Basics';
import { point, Props } from './common';
import { Icon } from './Icons';
import { connectAll } from './connect';
import {
    TextButtonProps, IconButtonProps, TagButtonProps,
    PaletteButtonProps, StretchTextButtonProps, SuperLink,
} from './Buttons';
import { colors, fontSize } from '../model';

// TODO: "disconnect" buttons in this file

function TextButtonC(props: TextButtonProps) {
    return <Link onClick={props.onClick}>
        <TextLine
            text={props.text}
            family={props.family}
            size={props.size}
        />
    </Link>;
}
export const TextButton = connectAll(TextButtonC);

function IconButtonC(props: IconButtonProps) {
    return <Button onClick={props.onClick}>
        <View
            style={{
                justifyContent: 'center',
                flexDirection: 'column',
            }}
        >
            <Icon
                name={props.icon}
                size={24}
            />
        </View>
    </Button>;
}
export const IconButton = connectAll(IconButtonC);

function TagButtonC(props: TagButtonProps) {
    return <Button onClick={props.onClick}>
        <View
            style={{
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: colors(props.theme).secondary,
                borderWidth: 1,
                borderColor: colors(props.theme).secondary,
                borderRadius: 50,
                paddingHorizontal: point(1),
                paddingVertical: point(0.2),
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                }
                }
            >
                <TextLine
                    text={props.text}
                    size='smallest'
                    family='menu'
                    color='accent'
                />
            </View>
        </View>
    </Button>;
}
export const TagButton = connectAll(TagButtonC);

function BorderButtonC(props: TextButtonProps) {
    return <Button onClick={props.onClick}>
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
            />
        </View>
    </Button>;
}
export const BorderButton = connectAll(BorderButtonC);

function PaletteButtonC(props: PaletteButtonProps) {
    const theme = props.theme;
    const cols = theme.palettes[theme.currentPalette].colors;
    return <Button onClick={props.onClick}>
        <View
            style={{
                flexDirection: 'column',
                width: 50,
                height: 50,
                justifyContent: 'center',
                backgroundColor: cols.primary,
                borderRadius: 50,
                borderColor: cols.highlight,
                borderWidth: props.palette === theme.currentPalette ? 3 : 0,
                shadowColor: cols.shadow,
                shadowRadius: 5,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                <Text style={{
                    color: cols.text,
                    fontSize: fontSize(props.theme, 'normal'),
                }}>
                    {props.text}
                </Text>
            </View>
        </View>
    </Button>;
}
export const PaletteButton = connectAll(PaletteButtonC);

function StretchTextButtonC(props: Props<StretchTextButtonProps>) {
    return <Button onClick={props.onClick}>
        <View style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
        }}
        >
            {props.children}
        </View>
    </Button>;
}
export const StretchTextButton = connectAll(StretchTextButtonC);

// =================================================

function Link({ onClick, children }: Props<SuperLink>) {
    return <Text onPress={onClick}>
        {children}
    </Text>;
}

function Button({ onClick, children }: Props<SuperLink>) {
    return <View onTouchEnd={onClick}>
        {children}
    </View>;
}

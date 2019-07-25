import * as React from 'react';

import { Text, View } from 'react-native';

import { TextLine } from './Basics';
import { point, WithChildren } from './common';
import { Icon } from './Icons';
import {
    TextButtonProps, IconButtonProps, TagButtonProps,
    PaletteButtonProps, StretchTextButtonProps, SuperLink,
} from './Buttons';
import { colors, fontSize } from '../model';

export function TextButton(props: TextButtonProps) {
    return <Link onClick={props.onClick}>
        <TextLine
            theme={props.theme}
            text={props.text}
            fontFamily={props.fontFamily}
            fontSize={props.fontSize}
        />
    </Link>;
}

export function IconButton(props: IconButtonProps) {
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

export function TagButton(props: TagButtonProps) {
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
                    theme={props.theme}
                    text={props.text}
                    fontSize='smallest'
                    color='accent'
                />
            </View>
        </View>
    </Button>;
}

export function BorderButton(props: TextButtonProps) {
    return <Button onClick={props.onClick}>
        <View style={{
            borderStyle: 'solid',
            borderColor: colors(props.theme).accent,
            borderRadius: 10,
            padding: point(0.3),
        }}>
            <TextLine
                color='accent'
                theme={props.theme}
                text={props.text}
                fontFamily={props.fontFamily}
                fontSize={props.fontSize}
            />
        </View>
    </Button>;
}

export function PaletteButton(props: PaletteButtonProps) {
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

export function StretchTextButton(props: WithChildren<StretchTextButtonProps>) {
    return <Button onClick={props.onClick}>
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'stretch',
            flexGrow: 1,
        }}
        >
            {props.children}
        </View>
    </Button>;
}

// =================================================

function Link({ onClick, children }: WithChildren<SuperLink>) {
    return <Text onPress={onClick}>
        {children}
    </Text>;
}

function Button({ onClick, children }: WithChildren<SuperLink>) {
    return <View onTouchEnd={onClick}>
        {children}
    </View>;
}

import * as React from 'react';

import { Theme, PaletteColor, colors, fontSize } from '../model';
import { ActivityIndicator, View } from 'react-native';
import { percent, point, Size, WithChildren, defaults } from './common';
import { platformValue } from '../utils';

export type TextProps = {
    fontFamily?: keyof Theme['fontFamilies'],
    fontSize?: keyof Theme['fontSizes'],
    color?: PaletteColor,
    bold?: boolean,
    italic?: boolean,
    letterSpacing?: Size,
};
export type TextLineProps = TextProps & {
    text: string | undefined,
    theme: Theme,
};
export function TextLine(props: TextLineProps) {
    return <span
        style={{
            fontSize: fontSize(props.theme, props.fontSize),
            fontFamily: props.theme.fontFamilies[props.fontFamily || 'menu'],
            color: props.color !== undefined ? colors(props.theme)[props.color] : undefined,
            letterSpacing: props.letterSpacing,
            fontWeight: props.bold ? 'bold' : 'normal',
            fontStyle: props.italic ? 'italic' : 'normal',
        }}
    >
        {props.text}
    </span>;
}

export type FullScreenActivityIndicatorProps = {
    theme: Theme,
};
export function FullScreenActivityIndicator(props: FullScreenActivityIndicatorProps) {
    return <View
        style={{
            position: 'fixed' as any,
            flexDirection: 'column',
            top: 0, left: 0,
            minHeight: '100%',
            minWidth: '100%',
            width: '100%',
            height: '100%',
            backgroundColor: defaults.semiTransparent,
            justifyContent: 'center',
            zIndex: 10,
        }}
    >
        <ActivityIndicator
            size='large'
            color={colors(props.theme).primary}
        />
    </View>;
}

export function Separator() {
    return <hr style={{
        width: percent(100),
    }} />;
}

// TODO: remove ?
export type ClickableProps = {
    onClick: () => void,
};
export function Clickable(props: WithChildren<ClickableProps>) {
    return <div onClick={props.onClick}>
        {props.children}
    </div>;
}

// TODO: remove ?
export function Tab() {
    return <span>&nbsp;&nbsp;</span>;
}

// TODO: remove ?
export type LayerProps = {
    theme: Theme,
};
export function Layer(props: WithChildren<LayerProps>) {
    return <View
        style={{
            position: 'absolute',
            minHeight: '100%',
            minWidth: '100%',
            width: platformValue({ mobile: '100%' }),
            height: platformValue({ mobile: '100%' }),
            backgroundColor: colors(props.theme).primary,
        }}
    >
        {props.children}
    </View>;
}

export function EmptyLine() {
    return <View
        style={{
            flexDirection: 'row',
            height: point(defaults.headerHeight),
        }}
    />;
}

export type PphProps = {
    indent?: boolean,
};
export function Pph({ indent, children }: WithChildren<PphProps>) {
    return <div style={{
        display: 'flex',
        textAlign: 'justify',
        float: 'left',
        textIndent: indent ? point(0) : point(4),
    }}>
        <span>
            {children}
        </span>
    </div>;
}

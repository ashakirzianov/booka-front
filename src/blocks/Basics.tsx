import * as React from 'react';

import { Theme, PaletteColor, colors, fontSize } from '../model';
import { Themeable, themed } from './connect';
import { defaults } from './defaults';
import { ActivityIndicator, View } from 'react-native';
import { percent, point, Size, Props } from './common';
import { platformValue } from '../utils';

export type TextProps = {
    family?: keyof Theme['fontFamilies'], // TODO: rename to 'fontFamily'
    size?: keyof Theme['fontSizes'], // TODO: rename to 'fontSize'
    color?: PaletteColor,
    bold?: boolean,
    italic?: boolean,
    letterSpacing?: Size,
    margin?: Size, // TODO: remove ?
    textAlign?: 'center', // TODO: remove ?
};
export type TextLineProps = TextProps & {
    text: string | undefined,
};
function TextLineC(props: Themeable<TextLineProps>) {
    return <span
        style={{
            fontSize: fontSize(props.theme, props.size),
            fontFamily: props.theme.fontFamilies[props.family || 'book'],
            color: props.color !== undefined ? colors(props.theme)[props.color] : undefined,
            letterSpacing: props.letterSpacing,
            margin: props.margin,
            textAlign: props.textAlign,
            fontWeight: props.bold ? 'bold' : 'normal',
            fontStyle: props.italic ? 'italic' : 'normal',
        }}
    >
        {props.text}
    </span>;
}
export const TextLine = themed(TextLineC);

function FullScreenActivityIndicatorC(props: Themeable) {
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
export const FullScreenActivityIndicator = themed(FullScreenActivityIndicatorC);

export function Separator() {
    return <hr style={{
        width: percent(100),
    }} />;
}

// TODO: remove ?
export function Line(props: Props) {
    return <View
        style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
        }}
    >
        {props.children}
    </View>;
}

// TODO: remove ?
export type ClickableProps = {
    onClick: () => void,
};
export function Clickable(props: Props<ClickableProps>) {
    return <div onClick={props.onClick}>
        {props.children}
    </div>;
}

// TODO: remove ?
export function Tab() {
    return <span>&nbsp;&nbsp;</span>;
}

// TODO: remove ?
function LayerC(props: Props<Themeable>) {
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
export const Layer = themed(LayerC);

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
export function Pph({ indent, children }: Props<PphProps>) {
    return <div style={{
        display: 'flex',
        textAlign: 'justify',
        float: 'left',
        textIndent: indent ? point(0) : point(2),
    }}>
        <span>
            {children}
        </span>
    </div>;
}

import * as React from 'react';

import { Theme, PaletteColor } from '../model';
import { Themeable, colors, themed } from './connect';
import { Column, Row } from './Layout';
import { defaults } from './defaults';
import { ActivityIndicator } from 'react-native';
import { percent, point, Size, Props } from './common';
import { platformValue } from '../utils';

export type TextLineStyle = {
    letterSpacing?: Size,
    margin?: Size,
    textAlign?: 'center',
};
export type TextProps = {
    // TODO: consider extract ?
    style?: TextLineStyle,
    family?: keyof Theme['fontFamilies'],
    size?: keyof Theme['fontSizes'],
    fixedSize?: boolean,
    color?: PaletteColor,
};
export type TextLineProps = TextProps & {
    text: string | undefined,
};
function TextLineC(props: Themeable<TextLineProps>) {
    const fontScale = props.fixedSize ? 1 : props.theme.fontScale;
    const fontSize = props.theme.fontSizes[props.size || 'normal'] * fontScale;
    const fontFamily = props.theme.fontFamilies[props.family || 'book'];
    return <span
        style={{
            fontSize,
            fontFamily,
            color: props.color !== undefined ? colors(props)[props.color] : undefined,
            ...props.style,
        }}
    >
        {props.text}
    </span>;
}
export const TextLine = themed(TextLineC);

function FullScreenActivityIndicatorC(props: Themeable) {
    return <Column style={{
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
        <ActivityIndicator
            size='large'
            color={colors(props).primary}
        />
    </Column>;
}
export const FullScreenActivityIndicator = themed(FullScreenActivityIndicatorC);

export function Separator() {
    return <hr style={{
        width: percent(100),
        marginTop: point(1),
        marginBottom: point(1),
    }} />;
}

// TODO: remove ?
export function Line(props: Props) {
    return <Row style={{
        width: '100%',
        justifyContent: 'space-between',
    }}>
        {props.children}
    </Row>;
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
    return <Column style={{
        position: 'absolute',
        minHeight: '100%',
        minWidth: '100%',
        width: platformValue({ mobile: '100%' }),
        height: platformValue({ mobile: '100%' }),
        backgroundColor: colors(props).primary,
    }}>
        {props.children}
    </Column>;
}
export const Layer = themed(LayerC);

export function EmptyLine() {
    return <Row
        style={{
            height: point(defaults.headerHeight),
        }}
    />;
}

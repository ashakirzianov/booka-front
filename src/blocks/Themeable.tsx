import * as React from 'react';

import { Theme } from '../model/theme';
import { Comp, Callback } from './comp-utils';
import * as Atoms from './Atoms';

// TODO: remove
const defaultTheme: Theme = {
    fontFamily: 'Georgia',
    baseFontSize: 26,
    largeFontSize: 30,
    largestFontSize: 36,
    foregroundColor: '#999999',
    backgroundColor: '#000000',
};

type ThemeableComp<T> = Comp<T & {
    theme: Theme,
}>;

function themed<T = {}>(C: ThemeableComp<T>): Comp<T> {
    return props => <C theme={defaultTheme} {...props} />;
}

type FontSizeName = 'baseFontSize' | 'largeFontSize' | 'largestFontSize';
type FontWeight = 'normal' | 'bold' | number;
type TextProps = {
    fontSizeKey: FontSizeName,
    fontWeight?: FontWeight,
    fontStyle?: 'italic',
    margin?: string,
    textAlign?: 'justify',
};
export const ThemedText = themed<TextProps>(props =>
    <Atoms.Text style={{
        fontFamily: props.theme.fontFamily,
        fontSize: props.theme[props.fontSizeKey],
        fontStyle: props.fontStyle,
        color: props.theme.foregroundColor,
        textAlign: props.textAlign,
    }}>
        {props.children}
    </Atoms.Text>,
);

export type LinkButtonProps = Atoms.TextProps & {
    text?: string,
    onClick?: Callback<void>,
    link?: string,
    stretch?: boolean,
    borders?: boolean,
};
export const LinkButton = themed<LinkButtonProps>(props =>
    <Atoms.Link
        text={props.text}
        to={props.link}
        onClick={props.onClick}
        style={{
            fontFamily: props.theme.fontFamily,
            fontSize: props.theme.baseFontSize,
            color: props.theme.foregroundColor,
            ...props.style,
            ...(props.borders && {
                border: 'solid',
                borderColor: props.theme.foregroundColor,
                borderRadius: 9,
            }),
        }}
        stretch={props.stretch}
    >{props.children}</Atoms.Link>,
);

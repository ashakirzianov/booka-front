import * as React from 'react';

import { Theme } from '../model/theme';
import { Comp, Callback } from './comp-utils';
import * as Atoms from './Atoms';
import { Defined } from '../utils';

// TODO: remove
const defaultTheme: Theme = {
    fontFamily: 'Georgia',
    fontSize: {
        normal: 26,
        large: 30,
        largest: 36,
    },
    foregroundColor: '#999999',
    backgroundColor: '#000000',
};

type ThemeableComp<T> = Comp<T & {
    theme: Theme,
}>;

function themed<T = {}>(C: ThemeableComp<T>): Comp<T> {
    return props => <C theme={defaultTheme} {...props} />;
}

type TextStyle = Defined<Atoms.TextProps['style']>;
type AllowedTextStyleProps = Pick<TextStyle,
    | 'fontWeight' | 'fontStyle' | 'textAlign' | 'margin'
    | 'textAlign'
>;
type TextProps = {
    style?: AllowedTextStyleProps,
    size?: keyof Theme['fontSize'],
};
export const Text = themed<TextProps>(props =>
    <Atoms.Text style={{
        fontFamily: props.theme.fontFamily,
        fontSize: props.theme.fontSize[props.size || 'normal'],
        color: props.theme.foregroundColor,
        ...props.style,
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
            fontSize: props.theme.fontSize.normal,
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

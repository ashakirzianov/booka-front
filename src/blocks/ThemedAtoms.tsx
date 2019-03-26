import * as React from 'react';

import { Theme } from '../model/theme';
import { Comp, Callback, connected, relative } from './comp-utils';
import * as Atoms from './Atoms';
import { Defined } from '../utils';
import { View } from 'react-native';

type ThemeableComp<T> = Comp<T & {
    theme: Theme,
}>;

function themed<T = {}>(C: ThemeableComp<T>) {
    return connected(['theme'], [])(C);
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
        color: props.theme.color.foreground,
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

export const LinkButton = themed<{
    to: string,
}>(props =>
    <Atoms.Link to={props.to}>
        <View style={{
            border: 'solid',
            borderColor: props.theme.color.foreground,
            borderRadius: props.theme.radius,
            padding: relative(0.3), // TODO: extract somewhere ?
        }}>
            <Text>
                {props.children}
            </Text>
        </View>
    </Atoms.Link>,
);

export const DottedLine = themed(props =>
    <View style={{
        flex: 1,
        borderBottom: 'dotted 0.2em',
        color: props.theme.color.foreground,
    }} />,
);

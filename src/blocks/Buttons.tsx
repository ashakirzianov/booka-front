import * as React from 'react';

// TODO: review imports
import { PaletteColor, PaletteName } from '../model';
import { TextLine, TextProps } from './Basics';
import { Callback, point, Props } from './common';
import { IconName } from './Icons.common';
import { Column, Row } from './Layout';
import { Icon } from './Icons';
import { colors, Themeable } from './connect';
import { Hyperlink } from './Web';

export type ButtonProps<T> = T & Themeable<{
    href?: string,
    onClick?: Callback<void>,
}>;

export type TextButtonProps = ButtonProps<TextProps & {
    text: string,
}>;
export function TextButton(props: TextButtonProps) {
    return <Button {...props}>
        <TextLine
            text={props.text}
            family={props.family}
            size={props.size}
            fixedSize={props.fixedSize} // TODO: remove this
            style={props.style}
        />
    </Button>;
}

export type IconButtonProps = ButtonProps<{
    icon: IconName,
}>;
export function IconButton(props: IconButtonProps) {
    return <Button
        {...props}
    >
        <Column style={{ justifyContent: 'center' }}>
            <Icon
                name={props.icon}
                color={colors(props).accent}
                hoverColor={colors(props).highlight}
                size={24}
            />
        </Column>
    </Button>;
}

export type TagButtonProps = ButtonProps<{
    text: string,
    color: PaletteColor,
    backgroundColor: PaletteColor,
    borderColor?: PaletteColor,
}>;
export function TagButton(props: TagButtonProps) {
    return <Button {...props}>
        <Column style={{
            justifyContent: 'center',
            backgroundColor: colors(props)[props.backgroundColor],
            borderWidth: props.borderColor ? 1 : undefined,
            borderColor: colors(props)[props.borderColor || props.backgroundColor],
            borderRadius: 50,
            paddingHorizontal: point(1),
            paddingVertical: point(0.2),
        }}>
            <Row style={{ justifyContent: 'center' }}>
                <TextLine
                    text={props.text}
                    size='smallest'
                    family='menu'
                    color={props.color}
                />
            </Row>
        </Column>
    </Button>;
}

export function BorderButton(props: TextButtonProps) {
    return <Button {...props}>
        <div
            style={{
                borderStyle: 'solid',
                fontSize: props.theme.fontSizes.normal,
                borderRadius: 10,
                padding: point(0.3),
            }}
        >
            <TextLine
                text={props.text}
                family={props.family}
                size={props.size}
                fixedSize={props.fixedSize} // TODO: remove this
                style={props.style}
            />
        </div>
    </Button>;
}

export type PaletteButtonProps = ButtonProps<{
    text: string,
    palette: PaletteName,
}>;
export function PaletteButton(props: PaletteButtonProps) {
    const theme = props.theme;
    const cols = theme.palettes[theme.currentPalette].colors;
    return <Button {...props}>
        <Column style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            backgroundColor: cols.primary,
            borderRadius: 50,
            borderColor: cols.highlight,
            borderWidth: props.palette === theme.currentPalette ? 3 : 0,
            shadowColor: cols.shadow,
            shadowRadius: 5,
            ':hover': {
                borderWidth: 3,
            },
        }}>
            <Row style={{ justifyContent: 'center' }}>
                <span style={{
                    color: cols.text,
                    fontSize: theme.fontSizes.normal,
                }}>
                    {props.text}
                </span>
            </Row>
        </Column>
    </Button>;
}

export type StretchTextButtonProps = ButtonProps<{
    texts: string[],
}>;
export function StretchTextButton(props: StretchTextButtonProps) {
    return <Button {...props}>
        <div style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
        }}
        >
            {props.texts.map((t, idx) => <TextLine key={idx} text={t} />)}
        </div>
    </Button>;
}

// =================================================

// TODO: remove
function Button({ href, onClick, theme, children }: Props<ButtonProps<{}>>) {
    return <Hyperlink
        href={href}
        style={{
            textDecoration: 'none',
            cursor: 'pointer',
            color: colors({ theme }).accent,
            borderColor: colors({ theme }).accent,
            ':hover': {
                color: colors({ theme }).highlight,
                borderColor: colors({ theme }).highlight,
            },
        }}
        onClick={onClick}
    >
        {children}
    </Hyperlink>;
}

// TODO: remove ?
// // TODO: better naming ?
// type LinkType = {
//     to: string | undefined,
//     onClick: Callback<React.MouseEvent>,
// };
// function buildLink({ action, state, dispatch, onClick }: ButtonProps): LinkType {
//     return {
//         to: action
//             ? actionToUrl(action, state)
//             : undefined,
//         onClick: e => {
//             e.stopPropagation();
//             if (!isOpenNewTabEvent(e)) {
//                 e.preventDefault();
//                 if (action) {
//                     dispatch(action);
//                 }
//                 if (onClick) {
//                     onClick();
//                 }
//             }
//         },
//     };
// }

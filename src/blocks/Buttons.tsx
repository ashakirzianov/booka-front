import * as React from 'react';

// TODO: review imports
import { Action, actionToUrl } from '../core';
import { App, PaletteColor, PaletteName } from '../model';
import { TextLine, TextProps } from './Basics';
import { Callback, point, Props } from './common';
import { IconName } from './Icons.common';
import { Column, Row } from './Layout';
import { Icon } from './Icons';
import { connectAll, colors } from './connect';
import { Hyperlink } from './Web';

export type ButtonProps = {
    state: App,
    dispatch: Callback<Action>,
    action?: Action,
    onClick?: Callback<void>,
};

export type TextButtonProps = ButtonProps & TextProps & {
    text: string,
};
function TextButtonC(props: TextButtonProps) {
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
export const TextButton = connectAll(TextButtonC);

export type IconButtonProps = ButtonProps & {
    icon: IconName,
};
function IconButtonC(props: IconButtonProps) {
    return <Button
        {...props}
    >
        <Column style={{ justifyContent: 'center' }}>
            <Icon
                name={props.icon}
                color={colors(props.state).accent}
                hoverColor={colors(props.state).highlight}
                size={24}
            />
        </Column>
    </Button>;
}
export const IconButton = connectAll(IconButtonC);

export type TagButtonProps = ButtonProps & {
    text: string,
    color: PaletteColor,
    backgroundColor: PaletteColor,
    borderColor?: PaletteColor,
};
function TagButtonC(props: TagButtonProps) {
    return <Button {...props}>
        <Column style={{
            justifyContent: 'center',
            backgroundColor: colors(props.state)[props.backgroundColor],
            borderWidth: props.borderColor ? 1 : undefined,
            borderColor: colors(props.state)[props.borderColor || props.backgroundColor],
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
export const TagButton = connectAll(TagButtonC);

function BorderButtonC(props: TextButtonProps) {
    return <Button {...props}>
        <div
            style={{
                borderStyle: 'solid',
                fontSize: props.state.theme.fontSizes.normal,
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
export const BorderButton = connectAll(BorderButtonC);

export type PaletteButtonProps = ButtonProps & {
    text: string,
    palette: PaletteName,
};
function PaletteButtonC(props: PaletteButtonProps) {
    const theme = props.state.theme;
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
export const PaletteButton = connectAll(PaletteButtonC);

export type StretchTextButtonProps = ButtonProps & {
    texts: string[],
};
function StretchTextButtonC(props: StretchTextButtonProps) {
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
export const StretchTextButton = connectAll(StretchTextButtonC);

// =================================================

// TODO: extract to Atoms ?
function Button({ action, state, dispatch, onClick, children }: Props<ButtonProps>) {
    const to = action && actionToUrl(action, state);
    return <Hyperlink
        href={to}
        style={{
            textDecoration: 'none',
            cursor: 'pointer',
            color: colors(state).accent,
            borderColor: colors(state).accent,
            ':hover': {
                color: colors(state).highlight,
                borderColor: colors(state).highlight,
            },
        }}
        onClick={() => {
            if (action) {
                dispatch(action);
            }
            if (onClick) {
                onClick();
            }
        }}
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

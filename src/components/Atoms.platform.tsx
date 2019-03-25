import * as React from 'react';
import { TextProps, TextCallbacks } from './Atoms';
import { Comp, VoidCallback, isOpenNewTabEvent, Callback, ReactContent } from './comp-utils';
import { navigateToUrl } from '../logic';
import { View } from 'react-native';

export const Text: Comp<TextProps, TextCallbacks> = props =>
    <span
        style={props.style}
        onClick={props.onClick}
    >
        {props.children}
    </span>;

export const ClickResponder: Comp<{ onClick?: VoidCallback }> = (props =>
    <div onClick={props.onClick}>
        {props.children}
    </div>
);

export const Tab: Comp = (props =>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
);

export const Link: Comp<TextProps & {
    text?: string,
    onClick?: Callback<void>,
    to?: string,
    stretch?: boolean,
}> = (props =>
    <View style={props.stretch && { flex: 1 }}>
        <a
            href={props.to}
            style={{
                textDecoration: 'none',
                cursor: 'pointer',
                ...props.style,
            }}
            onClick={e => {
                e.stopPropagation();
                if (!isOpenNewTabEvent(e)) {
                    e.preventDefault();
                    if (props.onClick) {
                        props.onClick();
                    } else if (props.to) {
                        navigateToUrl(props.to);
                    }
                }
            }}
        >
            <div style={{
                ...(props.stretch && {
                    display: 'flex',
                    justifyContent: 'space-between',
                }),
                margin: '0.3em',
            }}>
                {props.text || null}{props.children}
            </div>
        </a>
    </View>
    );

export function showAlert(message: string) {
    alert(message);
}

export const TopPanel: Comp = (props =>
    <div style={{
        width: '100%',
        position: 'fixed',
        top: 0,
        zIndex: 5,
    }}>
        {props.children}
    </div>
);

export const ModalBox: Comp<{
    header?: ReactContent,
    color?: string,
    heightPerc?: number,
    maxWidth?: number,
    onExternalClick?: Callback<any>,
}> = (props =>
    <div style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 10,
    }} onClick={props.onExternalClick}>
        <div style={{
            backgroundColor: props.color,
            borderRadius: 5,
            height: props.heightPerc ? `${props.heightPerc}%` : undefined,
            width: '100%',
            maxWidth: props.maxWidth && `${props.maxWidth}em`,
            margin: '0 auto',
            zIndex: 10,
        }}
            onClick={e => e.stopPropagation()}
        >
            {
                props.header
                    ? <div style={{
                        height: '10%',
                    }}>
                        {props.header}
                    </div>
                    : null
            }
            <div style={{
                overflowY: 'scroll',
                height: props.header ? '90%' : '100%',
            }}>
                {props.children}
            </div>
        </div>
    </div>
    );

export const Div: Comp = (props =>
    <div style={{ display: 'inline' }}>{props.children}</div>
);

export const NewLine: Comp = props => <br />;

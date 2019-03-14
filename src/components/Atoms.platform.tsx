import * as React from 'react';
import { TextProps, TextCallbacks } from './Atoms';
import { Comp, VoidCallback, isOpenNewTabEvent, Callback, ReactContent } from './comp-utils';
import { navigateToUrl } from '../logic';

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
    text: string,
    to: string,
}> = (props =>
    <a
        href={props.to}
        style={{
            textDecoration: 'none',
            cursor: 'pointer',
            ...props.style,
        }}
        onClick={e => {
            if (!isOpenNewTabEvent(e)) {
                e.preventDefault();
                navigateToUrl(props.to);
            }
        }}
    >{props.text}</a>
    );

export const ActionButton: Comp<TextProps & {
    text: string,
    onClick: Callback<void>,
}> = (props =>
    <a
        style={{
            textDecoration: 'none',
            cursor: 'pointer',
            ...props.style,
        }}
        onClick={() => {
            props.onClick();
        }}
    >{props.text}</a>
    );

export function showAlert(message: string) {
    alert(message);
}

export const ModalBox: Comp<{
    header?: ReactContent,
    color?: string,
    heightPerc?: number,
    maxWidth?: number,
}> = (props =>
    <div style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingTop: props.heightPerc && `${(100 - props.heightPerc) / 2}%`,
    }}>
        <div style={{
            backgroundColor: props.color,
            borderRadius: 5,
            width: '100%',
            maxWidth: props.maxWidth && `${props.maxWidth}em`,
            height: props.heightPerc ? `${props.heightPerc}%` : '100%',
            margin: '0 auto',
            overflowY: 'scroll',
        }}>
            {props.children}
        </div>
    </div>
    );

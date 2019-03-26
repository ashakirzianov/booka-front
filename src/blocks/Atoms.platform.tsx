import * as React from 'react';
import { TextProps } from './Atoms';
import { Comp, isOpenNewTabEvent, Callback } from './comp-utils';
import { navigateToUrl } from '../logic';

export const Text: Comp<TextProps> = props =>
    <span
        style={props.style}
    >
        {props.children}
    </span>;

export const Button: Comp<{
    onClick: Callback<void>,
}> = (props =>
    <div
        style={{
            cursor: 'pointer',
        }}
        onClick={e => {
            e.stopPropagation();
            props.onClick();
        }}
    >
        {props.children}
    </div>
    );

export const ClickResponder: Comp<{ onClick?: () => void }> = (props =>
    <div onClick={props.onClick}>
        {props.children}
    </div>
);

export const Tab: Comp = (props =>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
);

export const Link: Comp<{
    to: string,
}> = (props =>
    <a
        href={props.to}
        style={{
            textDecoration: 'none',
            cursor: 'pointer',
        }}
        onClick={e => {
            e.stopPropagation();
            if (!isOpenNewTabEvent(e)) {
                e.preventDefault();
                navigateToUrl(props.to);
            }
        }}
    >
        {props.children}
    </a>
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

// TODO: why do we need this ?
export const Div: Comp = (props =>
    <div style={{ display: 'inline' }}>{props.children}</div>
);

export const NewLine: Comp = props => <br />;

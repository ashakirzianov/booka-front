import * as React from 'react';
import { TextProps, TextPropsStyle } from './Atoms';
import { isOpenNewTabEvent, Callback, hoverable, Hoverable, connectAll } from './comp-utils';
import { navigateToUrl } from '../logic';
import { Action } from '../redux/actions';

export const Text = hoverable<TextProps>(props =>
    <span
        style={props.style}
    >
        {props.children}
    </span>,
);

export type LinkProps = {
    to?: string,
    action?: Callback<void>, // TODO: rethinks this
    style?: Hoverable<TextPropsStyle>,
};
export const Link = hoverable<LinkProps>(props =>
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
                if (props.action) {
                    props.action();
                } else if (props.to) {
                    navigateToUrl(props.to);
                }
            }
        }}
    >
        {props.children}
    </a>,
);

export type ActionLinkProps = {
    action?: Action,
    onClick?: Callback<void>,
    style?: Hoverable<TextPropsStyle>,
};
export const ActionLink = connectAll<ActionLinkProps>(props =>
    <Link action={() => {
        if (props.action) {
            props.dispatch(props.action);
        }
        if (props.onClick) {
            props.onClick();
        }
    }} to='' style={props.style}>
        {props.children}
    </Link>,
);

export function showAlert(message: string) {
    alert(message);
}

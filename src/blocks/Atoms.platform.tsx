import * as React from 'react';
import { TextProps, AllowedTextStyle } from './Atoms';
import { isOpenNewTabEvent, Callback, hoverable, Hoverable, connectAll } from './comp-utils';
import { Action } from '../redux/actions';
import { actionToUrl } from '../logic/urlConversion';

export const Text = hoverable<TextProps>(props =>
    <span
        style={{
            wordBreak: 'break-word',
            ...props.style,
        }}
    >
        {props.children}
    </span>
);

export type LinkProps = {
    to?: string,
    onClick?: Callback<void>, // TODO: rethinks this
    style?: Hoverable<AllowedTextStyle>,
};
export const Link = hoverable<LinkProps>(props =>
    <a
        href={props.to}
        style={{
            textDecoration: 'none',
            cursor: 'pointer',
            alignSelf: 'flex-start',
            ...props.style,
        }}
        onClick={e => {
            e.stopPropagation();
            if (!isOpenNewTabEvent(e)) {
                e.preventDefault();
                if (props.onClick) {
                    props.onClick();
                }
            }
        }}
    >
        {props.children}
    </a>
);

export type ActionLinkProps = {
    action?: Action,
    onClick?: Callback<void>,
    style?: Hoverable<AllowedTextStyle>,
};
export const ActionLink = connectAll<ActionLinkProps>(props =>
    <Link
        onClick={() => {
            if (props.action) {
                props.dispatch(props.action);
            }
            if (props.onClick) {
                props.onClick();
            }
        }}
        to={actionToUrl(props.action, props.state)}
        style={props.style}
    >
        {props.children}
    </Link>
);

export function showAlert(message: string) {
    alert(message);
}

import * as React from 'react';
import { TextProps, TextPropsStyle } from './Atoms';
import { isOpenNewTabEvent, Callback, hoverable, Hoverable, comp, connectDispatch } from './comp-utils';
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
    action: Action,
    style?: Hoverable<TextPropsStyle>,
};
export const ActionLink = connectDispatch<ActionLinkProps>(props =>
    <Link action={() => props.dispatch(props.action)} />,
);

export function showAlert(message: string) {
    alert(message);
}

import * as React from 'react';

import { Callback, connectAll } from '../blocks';
import { Action, actionToUrl } from '../core';
import { App } from '../model';
import * as Buttons from '../blocks/Buttons';

export const TextButton = connectButton(Buttons.TextButton);
export const IconButton = connectButton(Buttons.IconButton);
export const TagButton = connectButton(Buttons.TagButton);
export const PaletteButton = connectButton(Buttons.PaletteButton);
export const BorderButton = connectButton(Buttons.BorderButton);
export const StretchTextButton = connectButton(Buttons.StretchTextButton);

export type ConnectedButton<T> = T & {
    action?: Action,
    onClick?: Callback<void>,
};
function connectButton<T>(Button: React.ComponentType<Buttons.ButtonProps<T>>): React.ComponentType<ConnectedButton<T>> {
    type ResultT = ConnectedButton<T>;
    type ConnectedProps = {
        state: App,
        dispatch: Callback<Action>,
    };
    const result: React.FunctionComponent<ResultT & ConnectedProps> = props => {
        const href = props.action && actionToUrl(props.action, props.state);
        const onClick = () => {
            if (props.action) {
                props.dispatch(props.action);
            }
            if (props.onClick) {
                props.onClick();
            }
        };
        return <Button
            {...props}
            theme={props.state.theme}
            href={href}
            onClick={onClick}
        />;
    };
    // TODO: why 'as any' ?
    const connectedResult = connectAll<ResultT>(result as any);

    return connectedResult;
}

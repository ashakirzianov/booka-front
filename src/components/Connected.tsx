import * as React from 'react';
import { Callback } from 'booka-common';

import * as Blocks from '../atoms';
import { buildConnectRedux } from '../utils';
import { Action, actionToUrl, actionCreators } from '../core';
import { App } from '../model';

const connects = buildConnectRedux<App, typeof actionCreators>(actionCreators);
export const connect = connects.connect;
export const connectAll = connects.connectAll;
export const connectState = connects.connectState;
export const connectActions = connects.connectActions;

export const TextButton = connectButton(Blocks.TextButton);
export const IconButton = connectButton(Blocks.IconButton);
export const TagButton = connectButton(Blocks.TagButton);
export const PaletteButton = connectButton(Blocks.PaletteButton);
export const BorderButton = connectButton(Blocks.BorderButton);
export const StretchTextButton = connectButton(Blocks.StretchTextButton);

const theme = connectState('theme');
export const TextLine = theme(Blocks.TextLine);
export const TopBar = theme(Blocks.TopBar);
export const BottomBar = theme(Blocks.BottomBar);
export const FullScreenActivityIndicator = theme(Blocks.FullScreenActivityIndicator);
export const Modal = theme(Blocks.Modal);
export const WithPopover = theme(Blocks.WithPopover);

type ConnectedButton<T> = T & {
    action?: Action,
    onClick?: Callback<void>,
};
function connectButton<T>(Button: React.ComponentType<Blocks.ButtonProps<T>>): React.ComponentType<ConnectedButton<T>> {
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

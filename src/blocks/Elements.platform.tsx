import * as React from 'react';

import { ReactContent, Callback, themed, comp } from './comp-utils';

// TODO: why do we need this ?
export const Div = comp(props =>
    <div style={{ display: 'inline' }}>{props.children}</div>,
);

export const NewLine = comp(props => <br />);

export const Tab = comp(props =>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>,
);

export const ClickResponder = comp<{ onClick?: () => void }>(props =>
    <div onClick={props.onClick}>
        {props.children}
    </div>,
);

type ModalBoxProps = {
    header?: ReactContent,
    heightPerc?: number,
    maxWidth?: number,
    onExternalClick?: Callback<any>,
};
export const ModalBox = themed<ModalBoxProps>(props =>
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
            backgroundColor: props.theme.color.background, // TODO: add 'lightBackground' color
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
    </div>,
);

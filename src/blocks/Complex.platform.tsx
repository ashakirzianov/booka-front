import * as React from 'react';
import { LinkButton } from './Elements';
import { themed, Callback } from './comp-utils';

type ModalBoxProps = {
    open: boolean,
    title?: string,
    toggle: Callback<any>,
};
export const Modal = themed<ModalBoxProps>(props =>
    !props.open ? null :
        <div style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 10,
        }} onClick={props.toggle}>
            <div style={{
                backgroundColor: props.theme.color.secondBack,
                width: '100%',
                margin: '0 auto',
                zIndex: 10,
                borderRadius: props.theme.radius,
            }}
                onClick={e => e.stopPropagation()}
            >
                {
                    <div style={{
                        height: '10%',
                    }}>
                        <LinkButton action={props.toggle} />
                        {props.title}
                    </div>
                }
                <div style={{
                    overflowY: 'scroll',
                    height: '90%',
                }}>
                    {props.children}
                </div>
            </div>
        </div>,
);

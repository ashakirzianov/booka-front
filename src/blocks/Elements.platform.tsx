import * as React from 'react';

import * as Atoms from './Atoms';
import { Callback, themed, comp, relative, hoverable } from './comp-utils';

export const Inline = comp(props =>
    <div style={{ display: 'inline' }}>{props.children}</div>,
);

export const NewLine = comp(props => <br />);

export const Tab = comp(props =>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>,
);

export const DottedLine = comp(props =>
    <div key='aaa' style={{
        flex: 1,
        borderBottom: 'dotted 0.2em',
    }} />,
);

export const LinkButton = hoverable(themed<Atoms.LinkProps>(props =>
    <Atoms.Link {...props}>
        <div style={{
            border: 'solid',
            borderColor: props.theme.color.accent,
            color: props.theme.color.accent,
            fontSize: props.theme.fontSize.normal,
            borderRadius: props.theme.radius,
            padding: relative(0.3), // TODO: extract somewhere ?
            [':hover']: {
                borderColor: props.theme.color.highlight,
                color: props.theme.color.highlight,
            },
        }}>
            {props.children}
        </div>
    </Atoms.Link>,
));

export const Clickable = comp<{ onClick: () => void }>(props =>
    <div onClick={props.onClick}>
        {props.children}
    </div>,
);

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

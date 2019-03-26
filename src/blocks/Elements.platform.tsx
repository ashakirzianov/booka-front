import * as React from 'react';

import * as Atoms from './Atoms';
import { ReactContent, Callback, themed, comp, relative, hoverable } from './comp-utils';

export const Inline = comp(props =>
    <div style={{ display: 'inline' }}>{props.children}</div>,
);

export const NewLine = comp(props => <br />);

export const Tab = comp(props =>
    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>,
);

export const DottedLine = themed(props =>
    <div style={{
        flex: 1,
        borderBottom: 'dotted 0.2em',
        color: props.theme.color.foreground,
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
            backgroundColor: props.theme.color.secondBack,
            height: props.heightPerc ? `${props.heightPerc}%` : undefined,
            width: '100%',
            maxWidth: props.maxWidth && `${props.maxWidth}em`,
            margin: '0 auto',
            zIndex: 10,
            borderRadius: props.theme.radius,
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

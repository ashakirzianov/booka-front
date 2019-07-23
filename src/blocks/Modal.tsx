import * as React from 'react';

import { Transition } from 'react-transition-group';

import { TextLine } from './Basics';
import { IconButton } from './Buttons';
import { OverlayBox } from './OverlayBox';
import { Callback, Props } from './common';
import { Themeable, themed } from './connect';
import { defaults } from './defaults';
import { Triad } from './Layout';

export type ModalProps = Themeable<{
    open: boolean,
    title?: string,
    toggle: Callback<void>,
}>;

function ModalC(props: Props<ModalProps>) {
    return <Transition in={props.open} timeout={300}>
        {state => state === 'exited' ? null :
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                position: 'fixed',
                top: 0, bottom: 0, left: 0, right: 0,
                backgroundColor: defaults.semiTransparent,
                zIndex: 10,
                transition: `${defaults.animationDuration}ms ease-in-out`,
                opacity: state === 'entered' ? 1 : 0.01,
            }}
                onClick={props.toggle}
            >
                <OverlayBox
                    animation={{
                        entered: state === 'entered',
                    }}
                    theme={props.theme}>
                    <Triad
                        center={<TextLine
                            color='text'
                            text={props.title}
                        />}
                        left={<IconButton
                            theme={props.theme}
                            onClick={props.toggle}
                            icon='close'
                        />}
                    />
                    <div style={{
                        alignItems: 'stretch',
                        width: '100%',
                        overflowY: 'scroll',
                        maxHeight: '90%',
                    }}>
                        {props.children}
                    </div>
                </OverlayBox>

            </div>
        }
    </Transition>;
}
export const Modal = themed(ModalC);

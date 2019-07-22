import * as React from 'react';

import { Transition } from 'react-transition-group';

import { TextLine } from './Basics';
import { IconButton } from './Buttons';
import { OverlayBox } from './OverlayBox';
import { Callback, Props, point } from './common';
import { Themeable, themed } from './connect';
import { defaults } from './defaults';
import { Column, Row } from './Layout';

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
                    <Column style={{
                        justifyContent: 'center',
                        height: point(defaults.headerHeight),
                    }}>
                        <Row style={{
                            flex: 1,
                            justifyContent: 'center',
                        }}>
                            <Column style={{
                                position: 'absolute',
                                top: 0, left: 0, bottom: 0, right: 0,
                                justifyContent: 'center',
                            }}>
                                <IconButton
                                    theme={props.theme}
                                    onClick={props.toggle}
                                    icon='close'
                                />
                            </Column>
                            <Column style={{
                                justifyContent: 'center',
                            }}>
                                <TextLine text={props.title} />
                            </Column>
                            <Column />
                        </Row>
                    </Column>
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

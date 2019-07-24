import * as React from 'react';

import { Transition } from 'react-transition-group';

import { TextLine } from './Basics';
import { IconButton } from './Buttons';
import { OverlayBox } from './OverlayBox';
import { Callback, Props, defaults } from './common';
import { Themeable, themed } from './connect';
import { Triad, Row } from './Layout';
import { View } from 'react-native';

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
                    <View style={{ flex: 1 }}>
                        <Row>
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
                        </Row>
                        <View style={{
                            flex: 1,
                            alignItems: 'stretch',
                            overflowY: 'scroll',
                        }}
                        >
                            {props.children}
                        </View>
                    </View>
                </OverlayBox>
            </div>
        }
    </Transition>;
}
export const Modal = themed(ModalC);
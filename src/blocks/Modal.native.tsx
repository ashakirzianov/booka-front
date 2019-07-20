import * as React from 'react';

import {
    SafeAreaView, Modal as NativeModal,
} from 'react-native';
import { Column, Row } from './Layout';
import { percent, Props } from './common';
import { IconButton } from './Buttons';
import { TextLine } from './Basics';
import { ModalProps } from './Modal';

export { Layer } from './Basics.native';

export function Modal({ open, title, toggle, children }: Props<ModalProps>) {
    return <NativeModal
        visible={open}
        animationType='slide'
        onRequestClose={toggle}
    >
        <SafeAreaView>
            <Column style={{
                width: percent(100),
            }}>
                <Row style={{
                    justifyContent: 'center',
                    height: percent(5),
                }}>
                    <Column style={{
                        justifyContent: 'center',
                        position: 'absolute',
                        left: 0,
                    }}>
                        <IconButton
                            onClick={toggle}
                            icon='close'
                        />
                    </Column>
                    <Column style={{ justifyContent: 'center' }}>
                        <TextLine
                            text={title}
                            size='normal'
                        />
                    </Column>
                </Row>
                <Row style={{
                    height: percent(95),
                }}>{children}</Row>
            </Column>
        </SafeAreaView>
    </NativeModal>;
}

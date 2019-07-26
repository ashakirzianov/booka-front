import * as React from 'react';
import {
    SafeAreaView, Modal as NativeModal, View,
} from 'react-native';

import { percent } from './common';
import { IconButton } from './Buttons';
import { TextLine } from './Basics';
import { ModalProps } from './Modal';
import { Row, Triad } from './Layout';

export function Modal({ theme, open, title, toggle, children }: ModalProps) {
    return <NativeModal
        visible={open}
        animationType='slide'
        onRequestClose={toggle}
    >
        <SafeAreaView>
            <View style={{
                width: percent(100),
            }}>
                <Row>
                    <Triad
                        center={<TextLine
                            theme={theme}
                            color='text'
                            text={title}
                        />}
                        left={<IconButton
                            theme={theme}
                            onClick={toggle}
                            icon='close'
                        />}
                    />
                </Row>
                <View
                    style={{
                        flexDirection: 'row',
                        height: percent(95),
                    }}
                >
                    {children}
                </View>
            </View>
        </SafeAreaView>
    </NativeModal>;
}

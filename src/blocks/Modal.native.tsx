import * as React from 'react';
import {
    SafeAreaView, Modal as NativeModal, View,
} from 'react-native';

import { percent, WithChildren } from './common';
import { IconButton } from './Buttons';
import { TextLine } from './Basics';
import { ModalProps } from './Modal';

export function Modal({ theme, open, title, toggle, children }: WithChildren<ModalProps>) {
    return <NativeModal
        visible={open}
        animationType='slide'
        onRequestClose={toggle}
    >
        <SafeAreaView>
            <View style={{
                width: percent(100),
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    height: percent(5),
                }}>
                    <View style={{
                        justifyContent: 'center',
                        position: 'absolute',
                        left: 0,
                    }}>
                        <IconButton
                            theme={theme}
                            onClick={toggle}
                            icon='close'
                        />
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <TextLine
                            theme={theme}
                            text={title}
                            fontSize='normal'
                        />
                    </View>
                </View>
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

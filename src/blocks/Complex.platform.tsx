import * as React from 'react';
import { Callback, themed } from './comp-utils';
import { LinkButton, Text } from './Elements';
import { View } from 'react-native';
import { AnimatedVisibility } from './Animations.platform';

type ModalBoxProps = {
    open: boolean,
    title?: string,
    toggle: Callback<any>,
};
export const Modal = themed<ModalBoxProps>(props =>
    <AnimatedVisibility visible={props.open}>
        <div style={{
            position: 'fixed',
            top: 0, bottom: 0, left: 0, right: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 10,
        }}
            onClick={props.toggle}
        >
            <div style={{
                backgroundColor: props.theme.color.secondBack,
                width: '100%',
                maxWidth: '50em',
                margin: '0 auto',
                zIndex: 10,
                borderRadius: props.theme.radius,
            }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{
                    height: '10%',
                }}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                    }}>
                        <View>
                            <LinkButton action={props.toggle}>X</LinkButton>
                        </View>
                        <View style={{
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}>
                            <Text>{props.title}</Text>
                        </View>
                        <View />
                    </View>
                </div>
                <div style={{
                    overflowY: 'scroll',
                    height: '90%',
                }}>
                    {props.children}
                </div>
            </div>
        </div>
    </AnimatedVisibility>,
);

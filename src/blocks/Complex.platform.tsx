import * as React from 'react';
import { Callback, themed, comp } from './comp-utils';
import { Text, PanelLink } from './Elements';
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
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            position: 'fixed',
            top: 0, bottom: 0, left: 0, right: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 10,
        }}
            onClick={props.toggle}
        >
            <View style={{
                alignSelf: 'center',
                backgroundColor: props.theme.palette.secondBack,
                width: '100%',
                maxWidth: '50em',
                maxHeight: '100%',
                margin: '0 auto',
                zIndex: 10,
                borderRadius: props.theme.radius,
            }}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                }}>
                    <View>
                        <PanelLink action={props.toggle} icon='close' />
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        flexDirection: 'column',
                    }}>
                        <Text>{props.title}</Text>
                    </View>
                    <View />
                </View>
                <View style={{
                    overflowY: 'scroll',
                    maxHeight: '90%',
                }}>
                    {props.children}
                </View>
            </View>
        </div>
    </AnimatedVisibility>,
);

export const TopBar = comp<{ open: boolean }>(props =>
    <div style={{
        width: '100%',
        position: 'fixed',
        top: 0,
        zIndex: 5,
    }}>
        <AnimatedVisibility visible={props.open}>
            {props.children}
        </AnimatedVisibility>
    </div >,
);

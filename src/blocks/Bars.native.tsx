import * as React from 'react';

import { View, SafeAreaView } from 'react-native';

import { FadeIn } from './Animations.native';
import { BarProps } from './Bars';
import { point, WithChildren } from './common';
import { colors } from '../model';

const viewOffset = 3.5;
export const headerHeight = 3.5;
function bar(top: boolean) {
    return (props: WithChildren<BarProps>) =>
        <FadeIn visible={props.open}>
            <View style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'stretch',
                width: '100%',
                height: point(headerHeight + viewOffset),
                position: 'absolute',
                top: top ? 0 : undefined,
                bottom: !top ? 0 : undefined,
                left: 0,
                zIndex: 5,
                backgroundColor: colors(props.theme).secondary,
            }}>
                <SafeAreaView>
                    <View style={{
                        flexDirection: 'row',
                        alignSelf: 'stretch',
                        paddingHorizontal: props.paddingHorizontal,
                    }}>
                        {props.children}
                    </View>
                </SafeAreaView>
            </View >
        </FadeIn>;
}

export const TopBar = bar(true);
export const BottomBar = bar(false);

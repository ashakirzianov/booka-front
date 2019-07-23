import * as React from 'react';

import { View, SafeAreaView } from 'react-native';

import { themed } from './connect';
import { FadeIn } from './Animations.native';
import { BarProps } from './Bars';
import { point } from './common';
import { colors } from '../model';

const viewOffset = 3.5;
export const headerHeight = 3.5;
function bar(top: boolean) {
    return themed<BarProps>(props =>
        <FadeIn visible={props.open}>
            <View style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
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
                    {props.children}
                </SafeAreaView>
            </View >
        </FadeIn>
    );
}

export const TopBar = bar(true);
export const BottomBar = bar(false);

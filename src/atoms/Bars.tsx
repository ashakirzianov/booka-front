import * as React from 'react';
import { View } from 'react-native';

import { colors, Theme } from '../model';
import { WithChildren, point, defaults, Size } from './common';
import { FadeIn } from './Animations';

export type BarProps = WithChildren<{
    theme: Theme,
    open: boolean,
    paddingHorizontal?: Size,
}>;
function bar(top: boolean) {
    return function Bar(props: BarProps) {
        return <FadeIn visible={props.open}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                height: point(defaults.headerHeight),
                position: 'fixed',
                top: top ? 0 : undefined,
                bottom: !top ? 0 : undefined,
                left: 0,
                zIndex: 5,
                boxShadow: `0px 0px 1px ${colors(props.theme).shadow}`,
                backgroundColor: colors(props.theme).secondary,

            }}>
                <View style={{
                    flexDirection: 'row',
                    flex: 1,
                    paddingHorizontal: props.paddingHorizontal,
                }}>
                    {props.children}
                </View>
            </div>
        </FadeIn >;
    };
}

export const TopBar = bar(true);
export const BottomBar = bar(false);

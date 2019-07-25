import * as React from 'react';
import { View } from 'react-native';

import { colors, Theme } from '../model';
import { WithChildren, percent, point, defaults } from './common';

export type OverlayBoxProps = {
    theme: Theme,
    animation?: {
        entered: boolean,
    },
};
export function OverlayBox(props: WithChildren<OverlayBoxProps>) {
    return <View
        style={{
            alignSelf: 'center',
            backgroundColor: colors(props.theme).secondary,
            width: percent(100),
            maxWidth: point(50),
            maxHeight: percent(100),
            margin: '0 auto',
            borderRadius: props.theme.radius,
            padding: point(1),
            ...({
                boxShadow: `0px 0px 10px ${colors(props.theme).shadow}`,
                zIndex: 10,
            } as {}),
            ...(props.animation && {
                transitionDuration: `${defaults.animationDuration}ms`,
                transform: props.animation.entered ? [] : [{ translateY: '100%' as any }],
            }),
        }}
    >
        <div onClick={e => e.stopPropagation()} style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
        }}>
            {props.children}
        </div>
    </View>;
}

import * as React from 'react';
import { themed, palette, Comp } from './comp-utils';
import { View, ActivityIndicator as NativeActivityIndicator } from 'react-native';
import { platformValue } from '../utils';
import { defaults } from './defaults';

export * from './Complex.platform';

export const Layer = themed(props =>
    <View style={{
        position: 'absolute',
        minHeight: '100%',
        minWidth: '100%',
        width: platformValue({ mobile: '100%' }),
        height: platformValue({ mobile: '100%' }),
        backgroundColor: palette(props).primary,
    }}>
        {props.children}
    </View>
);

export const ActivityIndicator = themed(props =>
    <NativeActivityIndicator
        size='large'
        color={palette(props).primary}
    />
);

export const FullScreenActivityIndicator: Comp = (props =>
    <View style={{
        position: 'fixed' as any,
        top: 0, left: 0,
        minHeight: '100%',
        minWidth: '100%',
        width: '100%',
        height: '100%',
        backgroundColor: defaults.semiTransparent,
        justifyContent: 'center',
        zIndex: 10,
    }}>
        <ActivityIndicator />
    </View>
);

import * as React from 'react';
import { themed, palette } from './comp-utils';
import { View, ActivityIndicator as NativeActivityIndicator } from 'react-native';
import { platformValue } from '../utils';

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
    </View>,
);

export const FullScreenActivityIndicator = themed(props =>
    <View style={{
        position: 'fixed' as any,
        top: 0, left: 0,
        minHeight: '100%',
        minWidth: '100%',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0.0, 0.0, 0.0, 0.1)',
        justifyContent: 'center',
        zIndex: 10,
    }}>
        <NativeActivityIndicator
            size='large'
            color={palette(props).primary}
        />
    </View>,
);

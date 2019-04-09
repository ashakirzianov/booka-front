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

export const ActivityIndicator = themed(props =>
    <NativeActivityIndicator size='large' style={{
        position: 'absolute',
        minHeight: '100%',
        minWidth: '100%',
        width: platformValue({ mobile: '100%' }),
        height: platformValue({ mobile: '100%' }),
        backgroundColor: palette(props).primary,
    }} />,
);

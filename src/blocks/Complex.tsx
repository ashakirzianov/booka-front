import * as React from 'react';
import { themed, palette } from './comp-utils';
import { View } from 'react-native';
import { platformValue } from '../platform';

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

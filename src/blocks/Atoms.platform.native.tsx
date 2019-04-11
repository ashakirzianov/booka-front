import * as React from 'react';
import {
    Text as NativeText, Alert, TextStyle, StyleProp,
} from 'react-native';
import { Defined } from '../utils';
import { TextProps } from './Atoms';
import { comp } from './comp-utils';

export const Text = comp<TextProps>(props =>
    <NativeText
        style={convertStyle(props.style)}
    >
        {props.children}
    </NativeText>
);

export function showAlert(message: string) {
    Alert.alert('Alert', message);
}

type AtomTextStyle = Defined<TextProps['style']>;
type NativeTextStyle = StyleProp<TextStyle>;
function convertStyle(style: AtomTextStyle | undefined): NativeTextStyle | undefined {
    return style as any;
    // return style && {
    //     ...style,
    //     fontWeight: fontWeight(style.fontWeight),
    // };
}

// function fontWeight(w: AtomTextStyle['fontWeight']): TextStyle['fontWeight'] {
//     return w === undefined || typeof w === 'string' ? w :
//         (w <= 100 ? '100'
//             : w <= 200 ? '200'
//                 : w <= 300 ? '300'
//                     : w <= 400 ? '400'
//                         : w <= 500 ? '500'
//                             : w <= 600 ? '600'
//                                 : w <= 700 ? '700'
//                                     : w <= 800 ? '800'
//                                         : '900'
//         );
// }

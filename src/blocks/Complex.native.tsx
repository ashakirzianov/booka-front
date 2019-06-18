import * as React from 'react';

import { View } from 'react-native';
import { Complex, Layer } from './Complex.common';

const complex: Complex = {
    Layer,
    TopBar: props => <View>{props.children}</View>,
    BottomBar: props => <View>{props.children}</View>,
    Modal: props => <View>{props.children}</View>,
    WithPopover: props => <View>{props.children}</View>,
    OverlayBox: props => <View>{props.children}</View>,
    Clickable: props => <View>{props.children}</View>,
    LinkButton: props => <View>{props.children}</View>,
    Separator: props => <View>{props.children}</View>,
    Tab: props => <View>{props.children}</View>,
    DottedLine: props => <View>{props.children}</View>,
};
export default complex;

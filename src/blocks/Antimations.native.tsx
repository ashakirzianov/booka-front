import { Props } from './comp-utils';
import { FadeInProps } from './Animations.common';
import { View } from 'react-native';

export function FadeIn(props: Props<FadeInProps>) {
    return <View>{props.children}</View>;
}

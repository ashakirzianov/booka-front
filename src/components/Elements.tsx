import * as React from 'react';
import { Text, View, Link as AtomLink } from './Atoms';
import { Comp } from './comp-utils';
import { FlexStyle } from 'react-native';

export const TextBlock: Comp<{ text: string }> = props =>
    <Text style={{ fontSize: 16 }}>{'\t' /* React Native is missing text-indent styling */}{props.text}</Text>;

export const LinkButton: Comp<{ to: string, text: string }> = props =>
    <AtomLink to={props.to}>{props.text}</AtomLink>;

export type Align = FlexStyle['alignItems'];
export const Column: Comp<{
    maxWidth?: number,
    align?: Align,
}> = props =>
    <View style={{
        flexDirection: 'column',
        maxWidth: `${props.maxWidth}em`,
        alignItems: props.align,
    }}>
        {props.children}
    </View>;

export const Row: Comp = props =>
<View style={{ flexDirection: 'row' }}>{props.children}</View>;

export const ChapterTitle: Comp<{ text?: string }> = props =>
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16 }}>{props.text}</Text>
    </View>;

export const PartTitle: Comp<{ text?: string }> = props =>
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{props.text}</Text>
    </View>;

export const SubpartTitle: Comp<{ text?: string }> = props =>
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{props.text}</Text>
    </View>;

export const BookTitle: Comp<{ text?: string }> = props =>
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{props.text}</Text>
    </View>;

export {
    Text,
    Route, Redirect, Switch, Router,
} from './Atoms';

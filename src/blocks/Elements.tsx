import * as React from 'react';

import { ThemedText } from './Themeable';
import { comp } from './comp-utils';
import { Tab } from './Atoms';

export const CustomText = comp<{
    size?: 'regular' | 'large' | 'largest',
    bold?: boolean,
    italic?: boolean,
    justify?: boolean,
}>(props =>
    <ThemedText
        fontSizeKey={props.size === 'large' ? 'largeFontSize'
            : props.size === 'largest' ? 'largestFontSize'
                : 'baseFontSize'}
        fontWeight={props.bold ? 'bold' : 'normal'}
        fontStyle={props.italic ? 'italic' : undefined}
        textAlign={props.justify ? 'justify' : undefined}
    >
        {props.children}
    </ThemedText>,
);

export const RegularText = comp(props =>
    <CustomText>
        {props.children}
    </CustomText>);

// TODO: do we really need this ?
export const Label = comp<{ text: string, margin?: string }>(props =>
    <ThemedText margin={props.margin} fontSizeKey='baseFontSize'>
        {props.text}
    </ThemedText>,
);

export const ActivityIndicator = comp(props =>
    <Label text='Loading now...' />,
);

export const ParagraphText = comp<{ text: string }>(props =>
    <CustomText justify><Tab />{props.text}</CustomText>,
);

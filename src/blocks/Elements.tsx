import * as React from 'react';

import { comp } from './comp-utils';
import { Text } from './Themeable';

// TODO: do we really need this ?
export const Label = comp<{ text: string, margin?: string }>(props =>
    <Text style={{ margin: props.margin }} size='normal'>
        {props.text}
    </Text>,
);

export const ActivityIndicator = comp(props =>
    <Label text='Loading now...' />,
);

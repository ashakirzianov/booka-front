import * as React from 'react';
import { Text } from 'react-native';

import { Comp } from '../blocks';

export const ParagraphContainer: Comp<{ textIndent: string }> = (props =>
    <Text>
        {props.children}
    </Text>
);

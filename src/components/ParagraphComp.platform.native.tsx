import * as React from 'react';
import { Comp, Text } from '../blocks';

export const ParagraphContainer: Comp<{ textIndent: string }> = (props =>
    <Text>
        {props.children}
    </Text>
);

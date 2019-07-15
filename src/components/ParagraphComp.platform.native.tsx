import * as React from 'react';
import { Comp, View } from '../blocks';

export const ParagraphContainer: Comp<{ textIndent: string }> = (props =>
    <View>
        {props.children}
    </View>
);

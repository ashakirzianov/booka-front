import * as React from 'react';
import { Comp, View, ThemedText } from '../blocks';

export const ParagraphContainer: Comp<{ textIndent: string }> = (props =>
    <View>
        <ThemedText>
            {props.children}
        </ThemedText>
    </View>
);

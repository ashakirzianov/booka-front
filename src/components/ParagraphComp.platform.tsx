import * as React from 'react';
import { Comp, ThemedText, Size } from '../blocks';

export const ParagraphContainer: Comp<{ textIndent: Size }> = (props =>
    <ThemedText>
        <div style={{ display: 'flex' }}>
            <span style={{
                float: 'left',
                textIndent: props.textIndent,
            }}>
                {props.children}
            </span>
        </div>
    </ThemedText>
);

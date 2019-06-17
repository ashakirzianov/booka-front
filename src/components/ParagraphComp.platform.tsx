import * as React from 'react';
import { Comp } from '../blocks';

export const ParagraphContainer: Comp<{ textIndent: string }> = (props =>
    <div style={{ display: 'flex' }}>
        <span style={{
            float: 'left',
            textIndent: props.textIndent,
        }}>
            {props.children}
        </span>
    </div>
);

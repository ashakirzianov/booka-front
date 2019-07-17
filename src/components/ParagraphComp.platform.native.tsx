import * as React from 'react';
import { Comp, PlainText } from '../blocks';

export const ParagraphContainer: Comp<{ textIndent: string }> = (props =>
    <PlainText>
        {props.children}
    </PlainText>
);

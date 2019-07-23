import * as React from 'react';
import { Size, Props } from '../blocks';

// TODO: do we need 'textIndent' ?
// TODO: extract to 'blocks' ?
export function ParagraphContainer(props: Props<{ textIndent: Size }>) {
    return <div style={{
        display: 'flex',
        textAlign: 'justify',
    }}>
        <span style={{
            float: 'left',
            textIndent: props.textIndent,
        }}>
            {props.children}
        </span>
    </div>;
}

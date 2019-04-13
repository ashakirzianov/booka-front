import * as React from 'react';
import { Comp } from '../blocks';
import { SpanInfo, infoToId } from './ParagraphComp';

export const CapitalizeFirst: Comp<{ text: string, info: SpanInfo }> = (props => {
    const text = props.text.trimStart();
    const firstInfo = props.info;
    const secondInfo = {
        path: props.info.path.slice(),
    };
    secondInfo.path[secondInfo.path.length - 1] += 1;
    return <span>
        <span
            id={infoToId(firstInfo)}
            style={{
                float: 'left',
                fontSize: '400%',
                lineHeight: '80%',
            }}
        >
            {text[0]}
        </span>
        <span id={infoToId(secondInfo)}>
            {text.slice(1)}
        </span>
    </span>;
});

export const TextRun: Comp<{ text: string, info: SpanInfo }> = (props =>
    <span id={infoToId(props.info)}>
        {props.text}
    </span>
);

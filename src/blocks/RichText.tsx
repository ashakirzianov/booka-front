import * as React from 'react';

import {
    PlainText, point,
} from '../blocks';
import {
    TaggedRange, overlaps,
} from '../utils';

export function buildTextSegments(text: string, ranges: Array<TaggedRange<TextRendering, number>>): TextSegmentProps[] {
    const renderings = overlaps(ranges, (l, r) => l < r);
    const result: TextSegmentProps[] = renderings.map(r => ({
        text: text.substring(r.range.start, r.range.end),
        ...r,
    }));

    return result;
}

export type TextSegmentProps = TextRendering & {
    text: string,
};

export type TextRendering = {
    color?: string,
    background?: string,
    fontSize?: number,
    fontFamily?: string,
    dropCaps?: boolean,
    italic?: boolean,
    bold?: boolean,
    line?: boolean,
    id?: string,
    refHandler?: (ref: any) => void,
};

export type RichTextProps = {
    segments: TextSegmentProps[],
};
export function RichText(props: RichTextProps) {
    const children = props.segments.map((seg, idx) => {
        return <TextSegment
            {...seg}
            key={idx.toString()}
            refHandler={seg.refHandler}
        />;
    });

    return <>{children}</>;
}

function TextSegment(props: TextSegmentProps) {
    return <PlainText
        dropCaps={props.dropCaps}
        refHandler={props.refHandler}
        background={props.background}
        id={props.id}
        style={{
            color: props.color,
            fontSize: props.fontSize,
            fontFamily: props.fontFamily,
            fontStyle: props.italic ? 'italic' : 'normal',
            fontWeight: props.bold ? 'bold' : 'normal',
            ...(props.line && {
                textIndent: point(2),
                display: 'block',
            }),
        }}>
        {props.text}
    </PlainText>;
}

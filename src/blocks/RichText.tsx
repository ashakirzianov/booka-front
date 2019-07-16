import * as React from 'react';

import {
    PlainText, point,
} from '../blocks';
import {
    TaggedRange, overlaps,
} from '../utils';

export type RichTextStyle = {
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
    text: string,
    styles: Array<TaggedRange<RichTextStyle>>,
};
export function RichText({ text, styles }: RichTextProps) {
    const segments = buildTextSegments(text, styles);
    const children = segments.map((seg, idx) => {
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

function buildTextSegments(text: string, ranges: Array<TaggedRange<RichTextStyle, number>>): TextSegmentProps[] {
    const renderings = overlaps(ranges, (l, r) => l < r);
    const result: TextSegmentProps[] = renderings.map(taggedRange => ({
        text: text.substring(taggedRange.range.start, taggedRange.range.end),
        ...taggedRange.tag.reduce((res, r) => ({ ...res, ...r }), {}),
    }));

    return result;
}

type TextSegmentProps = RichTextStyle & {
    text: string,
};

import * as React from 'react';

import { TaggedRange, overlaps } from '../utils';
import { TextLink, TextSpan, TextLinkProps } from './Atoms';
import { point } from './common';

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
    superLink?: TextLinkProps,
};

export type RichTextProps = {
    text: string,
    styles: Array<TaggedRange<RichTextStyle>>,
};

export function RichText({ text, styles }: RichTextProps) {
    const segments = buildTextSegments(text, styles);
    const children = segments.map((seg, idx) => {
        return <TextSegmentComp
            {...seg}
            key={idx.toString()}
            refHandler={seg.refHandler}
        />;
    });

    return <>{children}</>;
}

type TextSegment = RichTextStyle & {
    text: string,
};

function TextSegmentComp(props: TextSegment) {
    const text = <TextSpan
        dropCaps={props.dropCaps}
        refHandler={props.refHandler}
        background={props.background}
        id={props.id}
        style={{
            color: props.color,
            fontSize: props.fontSize,
            fontFamily: props.fontFamily,
            fontStyle: props.italic
                ? 'italic' as 'italic'
                : 'normal' as 'normal',
            fontWeight: props.bold
                ? 'bold' as 'bold'
                : 'normal' as 'normal',
            ...(props.line && {
                textIndent: point(2),
                display: 'block',
            }),
        }}>
        {props.text}
    </TextSpan>;

    if (props.superLink) {
        return <TextLink {...props.superLink}>
            {text}
        </TextLink>;
    } else {
        return text;
    }
}

function buildTextSegments(text: string, ranges: Array<TaggedRange<RichTextStyle, number>>): TextSegment[] {
    const renderings = overlaps(ranges, (l, r) => l < r);
    const result: TextSegment[] = renderings.map(taggedRange => ({
        text: text.substring(taggedRange.range.start, taggedRange.range.end),
        ...taggedRange.tag.reduce((res, r) => ({ ...res, ...r }), {}),
    }));

    return result;
}

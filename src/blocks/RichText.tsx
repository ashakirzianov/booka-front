import * as React from 'react';

import { TaggedRange, overlaps } from '../utils';
import { TextLink, RichTextSpan, RichTextStyle } from './RichText.plat';

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
    const text = props.superLink
        ? <TextLink
            {...props.superLink}
            color={props.color}
            hoverColor={props.hoverColor}
        >
            {props.text}
        </TextLink>
        : props.text;
    const textSpan = <RichTextSpan
        {...props}
    >
        {text}
    </RichTextSpan>;

    return textSpan;
}

function buildTextSegments(text: string, ranges: Array<TaggedRange<RichTextStyle, number>>): TextSegment[] {
    const renderings = overlaps(ranges, (l, r) => l < r);
    const result: TextSegment[] = renderings.map(taggedRange => ({
        text: text.substring(taggedRange.range.start, taggedRange.range.end),
        ...taggedRange.tag.reduce((res, r) => ({ ...res, ...r }), {}),
    }));

    return result;
}

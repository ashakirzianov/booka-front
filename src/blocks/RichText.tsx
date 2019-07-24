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
            key={idx.toString()}
            text={seg.text}
            style={seg.style}
        />;
    });

    return <>{children}</>;
}

type TextSegment = {
    text: string,
    style: RichTextStyle,
};
function TextSegmentComp({ text, style }: TextSegment) {
    const textEl = style.superLink
        ? <TextLink
            href={style.superLink.href}
            onClick={style.superLink.onClick}
            color={style.color}
            hoverColor={style.hoverColor}
        >
            {text}
        </TextLink>
        : text;
    const textSpan = <RichTextSpan style={style}>
        {textEl}
    </RichTextSpan>;

    return textSpan;
}

function buildTextSegments(text: string, ranges: Array<TaggedRange<RichTextStyle, number>>): TextSegment[] {
    const renderings = overlaps(ranges, (l, r) => l < r);
    const result: TextSegment[] = renderings.map(taggedRange => ({
        text: text.substring(taggedRange.range.start, taggedRange.range.end),
        style: taggedRange.tag.reduce((res, r) => ({ ...res, ...r }), {}),
    }));

    return result;
}

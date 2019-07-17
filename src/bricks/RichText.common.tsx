import { SuperLink } from './Atoms.common';
import { TaggedRange, overlaps } from '../utils';

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
    superLink?: SuperLink,
};

export type RichTextProps = {
    text: string,
    styles: Array<TaggedRange<RichTextStyle>>,
};

export type TextSegment = RichTextStyle & {
    text: string,
};

export function buildTextSegments(text: string, ranges: Array<TaggedRange<RichTextStyle, number>>): TextSegment[] {
    const renderings = overlaps(ranges, (l, r) => l < r);
    const result: TextSegment[] = renderings.map(taggedRange => ({
        text: text.substring(taggedRange.range.start, taggedRange.range.end),
        ...taggedRange.tag.reduce((res, r) => ({ ...res, ...r }), {}),
    }));

    return result;
}

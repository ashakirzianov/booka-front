import * as React from 'react';

import {
    BookContentNode, Span, flatten, spanAttrs, assertNever,
    ParagraphNode, ChapterNode,
} from 'booka-common';

import {
    RichTextBlock, RichTextAttrs, RichTextFragment, RichText,
    Color,
} from './RichText';

export type BookFragmentProps = {
    nodes: BookContentNode[],
    color: Color,
    fontSize: number,
    fontFamily: string,
};

export function BookFragmentComp({ nodes, color, fontSize, fontFamily }: BookFragmentProps) {
    const blocks = flatten(nodes.map(blocksForNode));
    return <RichText
        blocks={blocks}
        color={color}
        fontSize={fontSize}
        fontFamily={fontFamily}
    />;
}

function blocksForNode(node: BookContentNode): RichTextBlock[] {
    switch (node.node) {
        case undefined:
            return blocksForParagraph(node);
        case 'chapter':
            return blocksForChapter(node);
        default:
            // TODO: assert 'never'
            return [];
    }
}

function blocksForParagraph(node: ParagraphNode): RichTextBlock[] {
    return [{
        fragments: fragmentsForSpan(node),
    }];
}

function blocksForChapter(node: ChapterNode): RichTextBlock[] {
    // TODO: support titles
    const inside = flatten(node.nodes.map(blocksForNode));
    return inside;
}

function fragmentsForSpan(span: Span): RichTextFragment[] {
    switch (span.span) {
        case undefined:
            return [{ text: span, attrs: {} }];
        case 'compound':
            return flatten(span.spans.map(fragmentsForSpan));
        case 'attrs':
            {
                const inside = fragmentsForSpan(span.content);
                const map = spanAttrs(span);
                const range: AttrsRange = {
                    attrs: {
                        italic: map.italic,
                        bold: map.bold,
                        line: map.line,
                    },
                    start: 0,
                };
                const result = applyAttrsRange(inside, range);
                return result;
            }
        case 'ref':
            {
                const inside = fragmentsForSpan(span.content);
                const range: AttrsRange = {
                    attrs: {
                        ref: span.refToId,
                    },
                    start: 0,
                };
                const result = applyAttrsRange(inside, range);
                return result;
            }
        default:
            assertNever(span);
            return [];
    }
}

type AttrsRange = {
    start: number,
    end?: number,
    attrs: RichTextAttrs,
};
function applyAttrsRange(fragments: RichTextFragment[], range: AttrsRange) {
    const result: RichTextFragment[] = [];
    let start = 0;
    for (const frag of fragments) {
        const end = frag.text.length;
        if (end <= range.start) {
            result.push(frag);
        } else if (start < range.start) {
            const pre: RichTextFragment = {
                text: frag.text.substring(0, range.start),
                attrs: frag.attrs,
            };
            if (range.end === undefined || range.end >= end) {
                const overlap: RichTextFragment = {
                    text: frag.text.substring(range.start),
                    attrs: {
                        ...frag.attrs,
                        ...range.attrs,
                    },
                };
                result.push(pre, overlap);
            } else {
                const overlap: RichTextFragment = {
                    text: frag.text.substring(range.start, range.end),
                    attrs: {
                        ...frag.attrs,
                        ...range.attrs,
                    },
                };
                const post: RichTextFragment = {
                    text: frag.text.substring(range.end),
                    attrs: {
                        ...frag.attrs,
                        ...range.attrs,
                    },
                };
                result.push(pre, overlap, post);
            }
        } else if (range.end === undefined || start < range.end) {
            const overlap: RichTextFragment = {
                text: frag.text.substring(0, range.end),
                attrs: {
                    ...frag.attrs,
                    ...range.attrs,
                },
            };
            if (range.end === undefined || end <= range.end) {
                result.push(overlap);
            } else {
                const post: RichTextFragment = {
                    text: frag.text.substring(range.end),
                    attrs: frag.attrs,
                };
                result.push(overlap, post);
            }
        } else {
            result.push(frag);
        }
        start = end;
    }

    return result;
}

import * as React from 'react';

import {
    BookContentNode, Span, flatten, spanAttrs, assertNever,
    ParagraphNode, ChapterNode, BookPath, isSubpath,
} from 'booka-common';

import {
    RichTextBlock, RichTextAttrs, RichTextFragment, RichText,
    Color,
    Path,
} from './RichText';

export type BookFragmentProps = {
    nodes: BookContentNode[],
    color: Color,
    fontSize: number,
    fontFamily: string,
    pathToScroll?: BookPath,
    onScroll?: (path: BookPath) => void,
};
export function BookFragmentComp({
    nodes, color, fontSize, fontFamily, pathToScroll, onScroll,
}: BookFragmentProps) {
    const blocksData = buildBlocksData(nodes);
    const scrollHandler = React.useCallback((path: Path) => {
        if (!onScroll) {
            return;
        } else {
            const bookPath = blocksData.blockPathToBookPath(path);
            onScroll(bookPath);
        }
    }, [onScroll, blocksData]);

    const blockPathToScroll = pathToScroll && blocksData.bookPathToBlockPath(pathToScroll);

    return <RichText
        blocks={blocksData.blocks}
        color={color}
        fontSize={fontSize}
        fontFamily={fontFamily}
        onScroll={scrollHandler}
        pathToScroll={blockPathToScroll}
    />;
}

// TODO: better naming
type BlocksData = {
    blocks: RichTextBlock[],
    blockPathToBookPath(path: Path): BookPath,
    bookPathToBlockPath(path: BookPath): Path,
};

function buildBlocksData(nodes: BookContentNode[]): BlocksData {
    const prefixedBlocks = flatten(nodes.map(blocksForNode));
    const blocks = prefixedBlocks.map(pb => pb.block);

    return {
        blocks,
        blockPathToBookPath(path) {
            const prefix = prefixedBlocks[path[0]].prefix;
            const bookPath = [...prefix, path[1]];
            return bookPath;
        },
        bookPathToBlockPath(path) {
            const blockIndex = prefixedBlocks
                .reverse()
                .findIndex(pb => isSubpath(pb.prefix, path));
            // TODO: implement
            return [blockIndex];
        },
    };
}

type BlockWithPrefix = {
    block: RichTextBlock,
    prefix: number[],
};
function blocksForNode(node: BookContentNode, idx: number): BlockWithPrefix[] {
    switch (node.node) {
        case undefined:
            return blocksForParagraph(node, idx);
        case 'chapter':
            return blocksForChapter(node, idx);
        default:
            // TODO: assert 'never'
            return [];
    }
}

function blocksForParagraph(node: ParagraphNode, idx: number): BlockWithPrefix[] {
    return [{
        block: {
            fragments: fragmentsForSpan(node),
        },
        prefix: [idx],
    }];
}

function blocksForChapter(node: ChapterNode, idx: number): BlockWithPrefix[] {
    // TODO: support titles
    const title: BlockWithPrefix = {
        block: {
            fragments: node.title.map(line => ({
                text: line,
                attrs: {},
            })),
        },
        prefix: [idx],
    };
    const inside = flatten(
        node.nodes
            .map((n, i) =>
                blocksForNode(n, i)
                    .map(b => ({
                        ...b, prefix: [idx, ...b.prefix],
                    }))
            )
    );
    return [title, ...inside];
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

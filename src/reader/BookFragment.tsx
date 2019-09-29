import * as React from 'react';

import {
    BookContentNode, Span, flatten, spanAttrs, assertNever,
    ParagraphNode, ChapterNode, BookPath, isSubpath, BookRange,
} from 'booka-common';

import {
    RichTextBlock, RichTextAttrs, RichTextFragment, RichText,
    Color, Path, RichTextSelection,
} from './RichText';

export type BookSelection = {
    text: string,
    range: BookRange,
};
export type BookFragmentProps = {
    nodes: BookContentNode[],
    color: Color,
    refColor: Color,
    refHoverColor: Color,
    fontSize: number,
    fontFamily: string,
    pathToScroll?: BookPath,
    onScroll?: (path: BookPath) => void,
    onSelectionChange?: (selection: BookSelection | undefined) => void,
};
export function BookFragmentComp({
    nodes, color, fontSize, fontFamily, refColor, refHoverColor,
    pathToScroll, onScroll, onSelectionChange,
}: BookFragmentProps) {
    const blocksData = buildBlocksData(nodes, {
        refColor: refColor,
        refHoverColor: refHoverColor,
    });
    const scrollHandler = React.useCallback((path: Path) => {
        if (!onScroll) {
            return;
        } else {
            const bookPath = blocksData.blockPathToBookPath(path);
            onScroll(bookPath);
        }
    }, [onScroll, blocksData]);

    const selectionHandler = React.useCallback((richTextSelection: RichTextSelection | undefined) => {
        if (!onSelectionChange) {
            return;
        }
        if (richTextSelection === undefined) {
            onSelectionChange(richTextSelection);
        } else {
            const start = blocksData.blockPathToBookPath(richTextSelection.range.start);
            const end = blocksData.blockPathToBookPath(richTextSelection.range.end);
            const bookSelection: BookSelection = {
                text: richTextSelection.text,
                range: { start, end },
            };
            onSelectionChange(bookSelection);
        }
    }, [onSelectionChange, blocksData]);

    const blockPathToScroll = pathToScroll && blocksData.bookPathToBlockPath(pathToScroll);

    return <RichText
        blocks={blocksData.blocks}
        color={color}
        fontSize={fontSize}
        fontFamily={fontFamily}
        onScroll={scrollHandler}
        pathToScroll={blockPathToScroll}
        onSelectionChange={selectionHandler}
    />;
}

type BuildBlocksEnv = {
    refColor: Color,
    refHoverColor: Color,
};
// TODO: better naming
type BlocksData = {
    blocks: RichTextBlock[],
    blockPathToBookPath(path: Path): BookPath,
    bookPathToBlockPath(path: BookPath): Path,
};

function buildBlocksData(nodes: BookContentNode[], env: BuildBlocksEnv): BlocksData {
    const prefixedBlocks = flatten(
        nodes.map((n, i) => blocksForNode(n, i, env))
    );
    const blocks = prefixedBlocks.map(pb => pb.block);
    // We want to find index of last (most precise) prefix, so reverse an array
    const prefixes = prefixedBlocks.map(pb => pb.prefix).reverse();

    return {
        blocks,
        blockPathToBookPath(path) {
            const prefix = prefixedBlocks[path[0]].prefix;
            const bookPath = path[1] !== undefined
                ? [...prefix, path[1]]
                : prefix;
            return bookPath;
        },
        bookPathToBlockPath(path) {
            const blockIndex = prefixes
                .findIndex(pre => isSubpath(pre, path));
            const idx = blockIndex >= 0
                // Convert to index in original, non-reversed array
                ? prefixes.length - blockIndex
                : undefined;

            return idx ? [idx] : [];
        },
    };
}

type BlockWithPrefix = {
    block: RichTextBlock,
    prefix: number[],
};
function blocksForNode(node: BookContentNode, idx: number, env: BuildBlocksEnv): BlockWithPrefix[] {
    switch (node.node) {
        case undefined:
            return blocksForParagraph(node, idx, env);
        case 'chapter':
            return blocksForChapter(node, idx, env);
        default:
            // TODO: assert 'never'
            return [];
    }
}

function blocksForParagraph(node: ParagraphNode, idx: number, env: BuildBlocksEnv): BlockWithPrefix[] {
    return [{
        block: {
            fragments: fragmentsForSpan(node, env),
        },
        prefix: [idx],
    }];
}

function blocksForChapter(node: ChapterNode, idx: number, env: BuildBlocksEnv): BlockWithPrefix[] {
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
                blocksForNode(n, i, env)
                    .map(b => ({
                        ...b, prefix: [idx, ...b.prefix],
                    }))
            )
    );
    return [title, ...inside];
}

function fragmentsForSpan(span: Span, env: BuildBlocksEnv): RichTextFragment[] {
    switch (span.span) {
        case undefined:
            return [{ text: span, attrs: {} }];
        case 'compound':
            return flatten(span.spans.map(s => fragmentsForSpan(s, env)));
        case 'attrs':
            {
                const inside = fragmentsForSpan(span.content, env);
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
                const inside = fragmentsForSpan(span.content, env);
                const range: AttrsRange = {
                    attrs: {
                        ref: span.refToId,
                        color: env.refColor,
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

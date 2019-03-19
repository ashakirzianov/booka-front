export type Paragraph = string;
export type SpanType<Key extends string> = {
    span: Key,
    text: string,
};
export type Span = SpanType<'italic'> | SpanType<'bold'> | SpanType<'normal'>;
export type ReachParagraph = {
    book: 'spans',
    content: Span[],
};
export type Chapter = {
    book: 'chapter',
    level: number,
    title?: string,
    content: BookNode[],
};

export type BookNode = Chapter | Paragraph | ReachParagraph;

export type BookMeta = {
    title: string,
    author?: string,
};
export type BookContent = {
    book: 'book',
    meta: BookMeta,
    content: BookNode[],
};

export function children(node: BookNode) {
    return isChapter(node) ? node.content : [];
}

// Type guards:

export function isParagraph(bn: BookNode): bn is Paragraph {
    return typeof bn === 'string';
}

export function isReachParagraph(bn: BookNode): bn is ReachParagraph {
    return typeof bn === 'object' && bn.book === 'spans';
}

export function isChapter(bn: BookNode): bn is Chapter {
    return typeof bn === 'object' && bn.book === 'chapter';
}

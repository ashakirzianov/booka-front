export type SpanType<Key extends string> = {
    span: Key,
    text: string,
};
export type Span = SpanType<'italic'> | SpanType<'bold'> | SpanType<'normal'>;
export type Paragraph = {
    node: 'paragraph',
    spans: Span[],
};
export type Chapter = {
    node: 'chapter',
    level: number,
    title?: string,
    nodes: BookNode[],
};

export type BookNode = Chapter | Paragraph;

export type BookMeta = {
    title: string,
    author?: string,
};
export type BookContent = {
    book: 'book',
    meta: BookMeta,
    nodes: BookNode[],
};

export function children(node: BookNode) {
    return isChapter(node) ? node.nodes : [];
}

// Type guards:

export function isParagraph(bn: BookNode): bn is Paragraph {
    return bn.node === 'paragraph';
}

export function isChapter(bn: BookNode): bn is Chapter {
    return bn.node === 'chapter';
}

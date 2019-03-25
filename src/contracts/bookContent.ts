export type AttributeName = 'italic' | 'poem' | 'line';
export type SimpleSpan = string;
export type AttributedSpan = {
    span: 'attrs',
    spans: Span[],
    attrs?: AttributeName[],
};
export type FootnoteId = string;
export type FootnoteSpan = {
    span: 'note',
    text?: string,
    id: FootnoteId,
};
export type Span = SimpleSpan | AttributedSpan | FootnoteSpan;

export type ParagraphNode = {
    node: 'paragraph',
    span: Span,
};
export type ChapterNode = {
    node: 'chapter',
    level: number,
    title?: string,
    nodes: BookNode[],
};

export type BookNode = ChapterNode | ParagraphNode;

export type Footnote = {
    id: FootnoteId,
    title?: string,
    content: ParagraphNode[],
};

export type BookMeta = {
    title: string,
    author?: string,
};

export type BookContent = {
    meta: BookMeta,
    nodes: BookNode[],
    footnotes: Footnote[],
};

// Helpers:

export function isChapter(bn: BookNode): bn is ChapterNode {
    return bn.node === 'chapter';
}

export function isParagraph(bn: BookNode): bn is ParagraphNode {
    return bn.node === 'paragraph';
}

export function isSimple(span: Span): span is SimpleSpan {
    return typeof span === 'string';
}

export function isFootnote(span: Span): span is FootnoteSpan {
    return typeof span === 'object' && span.span === 'note';
}

export function isAttributed(span: Span): span is AttributedSpan {
    return typeof span === 'object' && span.span === 'attrs';
}

export function children(node: BookNode) {
    return isChapter(node) ? node.nodes : [];
}

export function assign(...attributes: AttributeName[]) {
    return (spans: Span[]): AttributedSpan => {
        return {
            span: 'attrs',
            spans: spans,
            attrs: attributes,
        };
    };
}

export function compoundSpan(spans: Span[]): Span {
    return { spans, span: 'attrs' };
}

export function createParagraph(span: Span): ParagraphNode {
    return {
        node: 'paragraph',
        span,
    };
}

export function attrs(span: Span) {
    const arr = isAttributed(span) && span.attrs
        ? span.attrs
        : [];

    return attrObject(arr);
}

export type AttributesObject = {
    [k in AttributeName]?: boolean;
};
function attrObject(attributes: AttributeName[]): AttributesObject {
    return attributes
        .reduce((as, a) =>
            ({ ...as, [a]: true }), {} as AttributesObject);
}

export function contentToString(content: BookContent) {
    return JSON.stringify(content);
}

export function nodeToString(bn: BookNode) {
    return JSON.stringify(bn);
}

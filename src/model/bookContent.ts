export type Paragraph = string;
export type Chapter = {
    book: 'chapter',
    level: number,
    title?: string,
    content: BookNode[],
};

export type BookNode = Chapter | Paragraph;

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

export function isChapter(bn: BookNode): bn is Chapter {
    return typeof bn === 'object' && bn.book === 'chapter';
}

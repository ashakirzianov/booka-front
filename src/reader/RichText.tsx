import * as React from 'react';

export type Color = string;
export type RichTextAttrs = Partial<{
    color: Color,
    hoverColor: Color,
    background: Color,
    fontSize: number,
    fontFamily: string,
    dropCaps: boolean,
    italic: boolean,
    bold: boolean,
    // TODO: remove ?
    line: boolean,
    ref: string,
}>;
export type RichTextFragment = {
    text: string,
    attrs: RichTextAttrs,
};
export type RichTextBlock = {
    fragments: RichTextFragment[],
};

export type RichTextProps = {
    blocks: RichTextBlock[],
    color: Color,
    fontSize: number,
    fontFamily: string,
};
export function RichText({ blocks, color, fontSize, fontFamily }: RichTextProps) {
    return <span style={{
        color: color,
        fontSize: fontSize,
        fontFamily: fontFamily,
    }}>
        {blocks.map(
            (block, idx) =>
                <RichTextBlock
                    key={idx}
                    block={block}
                />
        )}
    </span>;
}

type RichTextBlockProps = {
    block: RichTextBlock,
};
function RichTextBlock({ block }: RichTextBlockProps) {
    return <div style={{
        display: 'flex',
        textAlign: 'justify',
        float: 'left',
        textIndent: '4em',
    }}>
        <span>
            {block.fragments.map(
                (frag, idx) =>
                    <RichTextFragment
                        fragment={frag}
                        key={idx}
                    />)}
        </span>
    </div>;
}

type RichTextFragmentProps = {
    fragment: RichTextFragment,
};
function RichTextFragment({ fragment: { text, attrs } }: RichTextFragmentProps) {
    return <span
        style={{
            wordBreak: 'break-word',
            color: attrs.color,
            background: attrs.background,
            fontSize: attrs.fontSize,
            fontFamily: attrs.fontFamily,
            fontStyle: attrs.italic ? 'italic' : undefined,
            fontWeight: attrs.bold ? 'bold' : undefined,
            ...(attrs.line && {
                textIndent: '2em',
                display: 'block',
            }),
            ...(attrs.dropCaps && {
                float: 'left',
                fontSize: attrs.fontSize
                    ? attrs.fontSize * 4
                    : '400%',
                lineHeight: '80%',
            }),
        }}
    >
        {text}
    </span>;
}

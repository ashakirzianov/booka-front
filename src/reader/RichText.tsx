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
export type RichTextBlock = RichTextFragment[];

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
        {blocks.map(RichTextBlock)}
    </span>;
}

function RichTextBlock(fragments: RichTextBlock) {
    return <span style={{
        // TODO: re-enable
        // display: 'flex',
        // textAlign: 'justify',
        // float: 'left',
        // textIndent: '4em',
    }}>
        {fragments.map(RichTextFragment)}
    </span>;
}

function RichTextFragment({ text, attrs }: RichTextFragment) {
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

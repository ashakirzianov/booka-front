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
    const refMap = React.useRef<PathMap<RefType>>(makePathMap());
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
                    refCallback={(ref, offset) => {
                        refMap.current.set([idx, offset], ref);
                    }}
                />
        )}
    </span>;
}

type RefType = HTMLSpanElement | null;
type RichTextBlockProps = {
    block: RichTextBlock,
    refCallback: (ref: RefType, offset: number) => void,
};
function RichTextBlock({ block, refCallback }: RichTextBlockProps) {
    const children: JSX.Element[] = [];
    let currentOffset = 0;
    for (let idx = 0; idx < block.fragments.length; idx++) {
        const frag = block.fragments[idx];
        const offset = currentOffset;
        children.push(<RichTextFragment
            key={idx}
            fragment={frag}
            refCallback={ref => refCallback(ref, offset)}
        />);
        currentOffset += frag.text.length;
    }

    return <div style={{
        display: 'flex',
        textAlign: 'justify',
        float: 'left',
        textIndent: '4em',
    }}>
        <span>
            {children}
        </span>
    </div>;
}

type RichTextFragmentProps = {
    fragment: RichTextFragment,
    refCallback: (ref: RefType) => void,
};
function RichTextFragment({ fragment: { text, attrs }, refCallback }: RichTextFragmentProps) {
    return <span
        ref={refCallback}
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

type PathMap<T> = {
    get(path: number[]): T | undefined,
    set(path: number[], value: T): void,
    iterator(): IterableIterator<[number[], T]>,
};

function makePathMap<T>(): PathMap<T> {
    type MapNode = {
        [idx: number]: {
            value?: T,
            children: PathMap<T>,
        } | undefined,
    };
    const node: MapNode = {};
    return {
        get(path) {
            if (path.length === 0) {
                return undefined;
            }
            const head = node[path[0]];
            if (path.length === 1) {
                return head && head.value;
            } else {
                return head && head.children.get(path.slice(1));
            }
        },
        set(path, value) {
            if (path.length === 0) {
                return;
            }
            let head = node[path[0]];
            if (head === undefined) {
                head = {
                    children: makePathMap(),
                };
                node[path[0]] = head;
            }
            if (path.length === 1) {
                head.value = value;
            } else {
                head.children.set(path.slice(1), value);
            }
        },
        iterator: function* () {
            for (const [key, value] of Object.entries(node)) {
                const idx = parseInt(key, 10);
                if (value) {
                    if (value.value) {
                        yield [[idx], value.value];
                    }
                    for (const [chPath, chValue] of value.children.iterator()) {
                        yield [[idx, ...chPath], chValue];
                    }
                }
            }
        },
    };
}

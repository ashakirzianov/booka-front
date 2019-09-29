import * as React from 'react';

export type Color = string;
export type Path = number[];
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
    pathToScroll?: Path,
    onScroll?: (path: Path) => void,
};
export function RichText({ blocks, color, fontSize, fontFamily, pathToScroll, onScroll }: RichTextProps) {

    const refMap = React.useRef<PathMap<RefType>>(makePathMap());
    const scrollHandler = React.useCallback(() => {
        if (!onScroll) {
            return;
        }
        const newCurrentPath = computeCurrentPath(refMap.current);
        if (newCurrentPath) {
            onScroll(newCurrentPath);
        }
    }, [onScroll]);
    useScroll(scrollHandler);

    React.useEffect(function scrollToCurrentPath() {
        if (pathToScroll) {
            const refToNavigate = refMap.current.get(pathToScroll);
            if (refToNavigate) {
                scrollToRef(refToNavigate);
            }
        }
    }, [pathToScroll]);

    return <span
        style={{
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
                        if (offset !== undefined) {
                            refMap.current.set([idx, offset], ref);
                        } else {
                            refMap.current.set([idx], ref);
                        }
                    }}
                />
        )}
    </span>;
}

type RefType = HTMLSpanElement | null;
type RichTextBlockProps = {
    block: RichTextBlock,
    refCallback: (ref: RefType, offset?: number) => void,
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
        <span ref={ref => refCallback(ref)}>
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

// Utils:

type PathMap<T> = {
    get(path: Path): T | undefined,
    set(path: Path, value: T): void,
    iterator(): IterableIterator<[Path, T]>,
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

// Scroll

function useScroll(callback?: (e: Event) => void) {
    React.useEffect(() => {
        if (callback) {
            window.addEventListener('scroll', callback);
        }

        return callback && function unsubscribe() {
            window.removeEventListener('scroll', callback);
        };
    }, [callback]);
}

function computeCurrentPath(refMap: PathMap<RefType>) {
    let last: number[] | undefined;
    for (const [path, ref] of refMap.iterator()) {
        const isVisible = isPartiallyVisible(ref);
        if (isVisible) {
            if (path) {
                last = path;
            }
        }
    }

    return last;
}

function isPartiallyVisible(ref?: RefType) {
    if (ref) {
        const rect = boundingClientRect(ref);
        if (rect) {
            const { top, height } = rect;
            const result = top <= 0 && top + height >= 0;
            if (result) {
                return result;
            }
        }
    }

    return false;
}

function boundingClientRect(ref?: RefType) {
    const current = ref;
    return current
        && current.getBoundingClientRect
        && current.getBoundingClientRect()
        ;
}

function scrollToRef(ref: RefType) {
    if (ref) {
        ref.scrollIntoView();
        // TODO: find other solution ?
        // window.scrollBy(0, 1); // Ugly -- fix issue with showing prev element path in the url after navigation
        return true;
    }
    return false;
}

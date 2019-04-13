import * as React from 'react';
import { Comp } from '../blocks';
import { SpanInfo, infoToId, HighlightData } from './ParagraphComp';
import { Color, bookRange, incrementPath, isOverlap, overlaps, BookRange, parentPath, samePath, BookPath } from '../model';
import { last } from '../utils';

export const ParagraphContainer: Comp<{ textIndent: string }> = (props =>
    <span style={{
        display: 'inline',
        float: 'left',
        textIndent: props.textIndent,
    }}>
        {props.children}
    </span>
);

export type TextRunProps = {
    text: string,
    info: SpanInfo,
    highlight: HighlightData,
};
export const CapitalizeFirst: Comp<TextRunProps> = (props => {
    const text = props.text.trimStart();
    const firstInfo = props.info;
    const secondInfo = {
        path: props.info.path.slice(),
    };
    secondInfo.path[secondInfo.path.length - 1] += 1;
    return <span>
        <span
            id={infoToId(firstInfo)}
            style={{
                float: 'left',
                fontSize: '400%',
                lineHeight: '80%',
            }}
        >
            {text[0]}
        </span>
        <span id={infoToId(secondInfo)}>
            {text.slice(1)}
        </span>
    </span>;
});

export const TextRun: Comp<TextRunProps> = (props => {
    const spans = buildHighlightedSpans(props.text, props.highlight, props.info);

    return <span>
        {
            spans.map((s, idx) =>
                <span key={idx} id={infoToId(s.info)} style={s.color !== undefined ? {
                    background: s.color,
                } : undefined}>
                    {s.text}
                </span>)
        }
    </span>;
});

type StyledSpan = {
    text: string,
    color?: Color,
    info: SpanInfo,
};

function buildHighlightedSpans(text: string, highlight: HighlightData, info: SpanInfo): StyledSpan[] {
    const spanRange = bookRange(info.path, incrementPath(info.path, text.length));
    if (!highlight.quote || !isOverlap(spanRange, highlight.quote.range)) {
        return [{ text, info }];
    }

    const os = Array.from(overlaps([{
        tag: 'normal',
        range: spanRange,
    }, {
        tag: 'highlighted',
        range: highlight.quote.range,
    }]));

    return os.map(tagged => ({
        text: subsForRange(text, spanRange.start, tagged.range),
        color: tagged.tag === 'normal'
            ? undefined
            : 'red',
        info: { path: tagged.range.start },
    }));
}

function subsForRange(s: string, start: BookPath, r: BookRange): string {
    const startParent = parentPath(start);
    if (!samePath(startParent, parentPath(r.start))) {
        return s;
    }
    const from = last(r.start) - last(start);
    if (!r.end || !samePath(startParent, parentPath(r.end))) {
        return s.substring(from);
    }
    const to = last(r.end) - last(start);
    return s.substring(from, to);
}

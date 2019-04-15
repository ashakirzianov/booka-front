import * as React from 'react';
import { Comp } from '../blocks';
import { SpanInfo, infoToId, HighlightData } from './ParagraphComp';
import {
    Color, bookRange, incrementPath, isOverlap,
    overlaps, BookRange, BookPath, pathLessThan, sameParent,
} from '../model';
import { last, filterUndefined } from '../utils';

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
    const children = spans.map(
        (s, idx) => !s ? null :
            <span key={idx} id={infoToId(s.info)} style={s.color !== undefined ? {
                background: s.color,
            } : undefined}>
                {s.text}
            </span>
    );

    return <span>
        {children}
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

    const result = os.map(tagged => {
        const spanText = subsForRange(text, info.path, tagged.range);
        return !spanText ? undefined : {
            text: spanText,
            color: tagged.tag === 'normal'
                ? undefined
                : 'red',
            info: { path: tagged.range.start },
        };
    });

    return filterUndefined(result);
}

function subsForRange(s: string, path: BookPath, r: BookRange): string | undefined {
    let from = 0;
    if (sameParent(r.start, path)) {
        from = last(r.start) - last(path);
    } else if (!pathLessThan(r.start, path)) {
        return undefined;
    }

    if (!r.end) {
        return s.substring(from);
    }

    if (sameParent(path, r.end)) {
        const to = last(r.end) - last(path);
        return s.substring(from, to);
    } else if (pathLessThan(path, r.end)) {
        return s.substring(from);
    } else {
        return undefined;
    }
}

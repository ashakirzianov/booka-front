import * as React from 'react';
import { Comp } from '../blocks';
import { pathToId, HighlightData } from './ParagraphComp';
import {
    Color, bookRange, incrementPath,
    overlaps, BookRange, BookPath, pathLessThan, sameParent, overlapWith,
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
    path: BookPath,
    highlight?: HighlightData,
};
export const CapitalizeFirst: Comp<TextRunProps> = (props => {
    const text = props.text.trimStart();
    const firstPath = props.path;
    const secondPath = props.path.slice();
    secondPath[secondPath.length - 1] += 1;
    return <span>
        <span
            id={pathToId(firstPath)}
            style={{
                float: 'left',
                fontSize: '400%',
                lineHeight: '80%',
            }}
        >
            {text[0]}
        </span>
        <span id={pathToId(secondPath)}>
            {text.slice(1)}
        </span>
    </span>;
});

export const TextRun: Comp<TextRunProps> = (props => {
    const spans = buildHighlightedSpans(props.text, props.path, props.highlight);
    const children = spans.map(
        (s, idx) => !s ? null :
            <span key={idx} id={pathToId(s.path)} style={s.color !== undefined ? {
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
    path: BookPath,
};

function buildHighlightedSpans(text: string, path: BookPath, highlight?: HighlightData): StyledSpan[] {
    if (!highlight || !highlight.quote) {
        return [{ text, path }];
    }

    const spanRange = bookRange(path, incrementPath(path, text.length));
    const relevant = overlapWith(spanRange, [{
        tag: highlight.quote,
        range: highlight.quote.range,
    }]);
    relevant.push({ range: spanRange });

    const os = overlaps(relevant);

    const result = os.map(tagged => {
        const spanText = subsForRange(text, path, tagged.range);
        return !spanText ? undefined : {
            text: spanText,
            color: tagged.tags.length > 0
                ? 'red'
                : undefined,
            path: tagged.range.start,
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

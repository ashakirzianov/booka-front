import * as React from 'react';
import { Comp } from '../blocks';
import { pathToId, Colorization } from './ParagraphComp';
import {
    Color, bookRange, incrementPath,
    overlaps, BookRange, BookPath, pathLessThan, sameParent, overlapWith, inRange,
} from '../model';
import { last, filterUndefined } from '../utils';
import { RefPathHandler } from './bookRender';

export const ParagraphContainer: Comp<{ textIndent: string }> = (props =>
    <div style={{ display: 'flex' }}>
        <span style={{
            float: 'left',
            textIndent: props.textIndent,
        }}>
            {props.children}
        </span>
    </div>
);

export type TextRunProps = {
    text: string,
    path: BookPath,
    refPathHandler: RefPathHandler,
    colorization?: Colorization,
};
export const CapitalizeFirst: Comp<TextRunProps> = (props => {
    const text = props.text.trimStart();
    const firstPath = props.path;
    const firstHighlight = colorsForPath(firstPath, props.colorization)[0];
    const secondPath = props.path.slice();
    secondPath[secondPath.length - 1] += 1;
    return <span>
        <span
            ref={ref => props.refPathHandler(ref, firstPath)}
            id={pathToId(firstPath)}
            style={{
                float: 'left',
                fontSize: '400%',
                lineHeight: '80%',
                background: firstHighlight,
            }}
        >
            {text[0]}
        </span>
        <TextRun {...props} text={text.slice(1)} />
    </span>;
});

export const TextRun: Comp<TextRunProps> = (props => {
    const spans = buildColorizedSpans(props.text, props.path, props.colorization);
    const children = spans.map(
        (s, idx) => !s ? null :
            <span
                key={idx}
                id={pathToId(s.path)}
                ref={ref => props.refPathHandler(ref, s.path)}
                style={s.color !== undefined ? {
                    background: s.color,
                } : undefined}
            >
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

function colorsForPath(path: BookPath, colorization?: Colorization) {
    if (!colorization) {
        return [];
    }

    const colors = colorization.ranges.map(cr =>
        inRange(path, cr.range) ? cr.color : undefined);

    return filterUndefined(colors);
}

function buildColorizedSpans(text: string, path: BookPath, colorization?: Colorization): StyledSpan[] {
    if (!colorization || colorization.ranges.length < 1) {
        return [{ text, path }];
    }

    const spanRange = bookRange(path, incrementPath(path, text.length));
    const relevant = overlapWith(spanRange, colorization.ranges.map(cr => ({
        tag: cr.color,
        range: cr.range,
    })));
    relevant.push({ range: spanRange });

    const os = overlaps(relevant);

    const result = os.map(tagged => {
        const spanText = subsForRange(text, path, tagged.range);
        return !spanText ? undefined : {
            text: spanText,
            color: tagged.tags.length > 0
                ? tagged.tags[0]
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

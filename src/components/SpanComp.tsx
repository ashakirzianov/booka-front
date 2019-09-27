import * as React from 'react';
import {
    Span, Callback,
    BookRange, BookPath, pathLessThan, isSubpath,
} from 'booka-common';
import {
    Color, Theme, colors, fontSize,
} from '../model';
import {
    RichText,
} from '../reader';
import {
    range, Range,
} from '../utils';
import { RefPathHandler } from './common';

export type ColorizedRange = {
    color: Color,
    range: BookRange,
};
export type Colorization = {
    ranges: ColorizedRange[],
};

export type SpanProps = {
    span: Span,
    path: BookPath,
    first: boolean,
    refPathHandler: RefPathHandler,
    colorization?: Colorization,
    theme: Theme,
    openFootnote: Callback<string>,
};
export function SpanComp(props: SpanProps) {
    const fragments = [] as any[];
    const blocks = [fragments];

    return <RichText
        blocks={blocks}
        color={colors(props.theme).text}
        fontFamily={props.theme.fontFamilies.book}
        fontSize={fontSize(props.theme, 'text')}
    />;
}

export function rangeRelativeToPath(path: BookPath, bookR: BookRange): Range | undefined {
    if (bookR.end && pathLessThan(bookR.end, path)) {
        return undefined;
    }

    if (!pathLessThan(path, bookR.start)) {
        return range(0);
    }

    let start: number | undefined;
    if (isSubpath(path, bookR.start)) {
        start = bookR.start[path.length];
    }
    let end: number | undefined;
    if (bookR.end && isSubpath(path, bookR.end)) {
        end = bookR.end[path.length];
    }

    return start !== undefined
        ? range(start, end)
        : undefined;
}

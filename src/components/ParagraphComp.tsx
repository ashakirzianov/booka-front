import * as React from 'react';
import {
    themed, highlights, point, colors,
} from '../blocks';
import {
    ParagraphNode, Highlights, BookPath,
} from '../model';
import { ParagraphContainer } from './ParagraphComp.platform';
import { SpanComp } from './SpanComp';
import { RefPathHandler } from './common';

export type ParagraphProps = {
    p: ParagraphNode,
    path: BookPath,
    first: boolean,
    refPathHandler: RefPathHandler,
    highlights?: Highlights,
};
export const ParagraphComp = themed<ParagraphProps>(function ParagraphCompC(props) {
    return <ParagraphContainer textIndent={point(props.first ? 0 : 2)}>
        <SpanComp
            {...props}
            fontSize={props.theme.fontSizes.normal * props.theme.fontScale}
            color={colors(props).text}
            path={props.path.concat([0])}
            span={props.p.span}
            colorization={props.highlights && props.highlights.quote && {
                ranges: [{
                    color: highlights(props).quote,
                    range: props.highlights.quote,
                }],
            }}
        />
    </ParagraphContainer>;
});

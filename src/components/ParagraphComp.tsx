import * as React from 'react';
import {
    highlights, point, connect,
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
export const ParagraphComp = connect(['theme'], ['openFootnote'])<ParagraphProps>(function ParagraphCompC(props) {
    return <ParagraphContainer textIndent={point(props.first ? 0 : 2)}>
        <SpanComp
            {...props}
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

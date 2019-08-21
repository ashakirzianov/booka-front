import * as React from 'react';

import { ParagraphNode } from 'booka-common';
import { Pph } from '../blocks';
import { Highlights, BookPath, highlights } from '../model';
import { SpanComp } from './SpanComp';
import { RefPathHandler } from './common';
import { connect } from './Connected';

export type ParagraphProps = {
    p: ParagraphNode,
    path: BookPath,
    first: boolean,
    refPathHandler: RefPathHandler,
    highlights?: Highlights,
};
export const ParagraphComp = connect(['theme'], ['openFootnote'])<ParagraphProps>(function ParagraphCompC(props) {
    return <Pph indent={props.first}>
        <SpanComp
            first={props.first}
            refPathHandler={props.refPathHandler}
            openFootnote={props.openFootnote}
            theme={props.theme}
            path={props.path.concat([0])}
            span={props.p.span}
            colorization={props.highlights && props.highlights.quote && {
                ranges: [{
                    color: highlights(props.theme).quote,
                    range: props.highlights.quote,
                }],
            }}
        />
    </Pph>;
});

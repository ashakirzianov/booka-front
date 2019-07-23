import * as React from 'react';
import { connect, Pph } from '../blocks';
import {
    ParagraphNode, Highlights, BookPath, highlights,
} from '../model';
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
    return <Pph indent={props.first}>
        <SpanComp
            {...props} // TODO: remove ?
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

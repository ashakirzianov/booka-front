import * as React from 'react';

import { LibraryScreen } from '../model';
import { Comp, TextLine, Row } from '../blocks';
import { LibraryComp } from './LibraryComp';

export const LibraryScreenHeader: Comp = (props =>
    <Row centered fullWidth>
        <TextLine text='Library' />
    </Row>
);

export const LibraryScreenComp: Comp<LibraryScreen> = (props =>
    <LibraryComp {...props.library} />
);

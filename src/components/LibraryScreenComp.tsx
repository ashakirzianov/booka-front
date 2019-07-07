import * as React from 'react';

import { LibraryScreen } from '../model';
import { Comp, Label, Row, percent } from '../blocks';
import { LibraryComp } from './LibraryComp';

export const LibraryScreenHeader: Comp = (props =>
    <Row style={{
        width: percent(100),
        justifyContent: 'center',
    }}>
        <Label text='Library' />
    </Row>
);

export const LibraryScreenComp: Comp<LibraryScreen> = (props =>
    <LibraryComp {...props.library} />
);

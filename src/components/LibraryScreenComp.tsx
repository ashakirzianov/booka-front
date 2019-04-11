import * as React from 'react';

import { LibraryScreen } from '../model';
import { comp, Label, Row } from '../blocks';
import { LibraryComp } from './LibraryComp';

export const LibraryScreenHeader = comp(props =>
    <Row style={{ flex: 1, justifyContent: 'center' }}>
        <Label text='Library' />
    </Row>
);

export const LibraryScreenComp = comp<LibraryScreen>(props =>
    <LibraryComp {...props.library} />
);

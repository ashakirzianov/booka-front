import * as React from 'react';

import { LibraryScreen } from '../model';
import { LibraryComp } from './LibraryComp';
import { Comp } from './comp-utils';

export const LibraryScreenHeader: Comp = (props => null);

export const LibraryScreenComp: Comp<LibraryScreen> = (props =>
    <LibraryComp {...props.library} />
);

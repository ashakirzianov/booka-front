import * as React from 'react';

import { LibraryScreen } from '../model';
import { Comp } from '../blocks';
import { LibraryComp } from './LibraryComp';

export const LibraryScreenHeader: Comp = (props => null);

export const LibraryScreenComp: Comp<LibraryScreen> = (props =>
    <LibraryComp {...props.library} />
);

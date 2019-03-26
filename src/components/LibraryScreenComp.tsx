import * as React from 'react';

import { LibraryScreen } from '../model';
import { comp } from '../blocks';
import { LibraryComp } from './LibraryComp';

export const LibraryScreenHeader = comp(props => null);

export const LibraryScreenComp = comp<LibraryScreen>(props =>
    <LibraryComp {...props.library} />,
);

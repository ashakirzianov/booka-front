import * as React from 'react';

import { Screen } from '../model';
import { CurrentBookComp } from './BookComp';
import { CurrentLibraryComp } from './LibraryComp';
import { assertNever } from '../utils';
import { Comp } from './comp-utils';

export const ScreenComp: Comp<Screen> = (props =>
    props.screen === 'book' ? <CurrentBookComp />
        : props.screen === 'library' ? <CurrentLibraryComp />
            : assertNever(props)
);

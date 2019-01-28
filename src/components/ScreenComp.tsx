import * as React from 'react';

import { Screen } from '../model';
import { CurrentBookComp } from './BookComp';
import { CurrentLibraryComp } from './LibraryComp';
import { assertNever } from '../utils';
import { Comp } from './comp-utils';
import { TextBlock } from './Elements';

export const BlankScreenComp: Comp = props =>
    <TextBlock text='Nothing here. This screen should never be visible' />;

export const ScreenComp: Comp<Screen> = (props =>
    props.screen === 'book' ? <CurrentBookComp />
        : props.screen === 'library' ? <CurrentLibraryComp />
            : props.screen === 'blank' ? <BlankScreenComp />
                : assertNever(props)
);

import * as React from 'react';

import { Screen } from '../model';
import { ConnectedBookComp } from './BookComp';
import { ConnectedLibraryComp } from './LibraryComp';
import { assertNever } from '../utils';
import { Comp } from './comp-utils';
import { TextBlock } from './Elements';

export const BlankScreenComp: Comp = props =>
    <TextBlock text='Nothing here. This screen should never be visible' />;

export const ScreenComp: Comp<Screen> = (props =>
    props.screen === 'book' ? <ConnectedBookComp />
        : props.screen === 'library' ? <ConnectedLibraryComp />
            : props.screen === 'blank' ? <BlankScreenComp />
                : assertNever(props)
);

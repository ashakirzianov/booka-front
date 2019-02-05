import * as React from 'react';

import { Screen, BookScreen, LibraryScreen } from '../model';
import { BookComp } from './BookComp';
import { LibraryComp } from './LibraryComp';
import { assertNever } from '../utils';
import { Comp } from './comp-utils';
import { Label } from './Elements';
import { api } from '../api';
import { OptimisticPromise } from '../promisePlus';

type Navigation = { navigateToScreen: OptimisticPromise<Screen> }
export const ScreenComp: Comp<Screen, Navigation> = (props =>
    props.screen === 'book' ? <BookScreenComp {...props} />
        : props.screen === 'library' ? <LibraryScreenComp {...props} />
            : props.screen === 'blank' ? <BlankScreenComp />
                : assertNever(props)
);

const BookScreenComp: Comp<BookScreen> = (props =>
    <BookComp {...props.book} />
);

const LibraryScreenComp: Comp<LibraryScreen, Navigation> = (props =>
    <LibraryComp {...props.library} openBook={
        bl => props.navigateToScreen && props.navigateToScreen(api.bookScreen(bl))
    } />
);

const BlankScreenComp: Comp = (props =>
    <Label text='Nothing here. This screen should never be visible' />
);
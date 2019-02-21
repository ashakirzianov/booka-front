import * as React from 'react';

import { Screen, BookScreen, LibraryScreen } from '../model';
import { BookComp } from './BookComp';
import { LibraryComp } from './LibraryComp';
import { assertNever } from '../utils';
import { Comp, comp, connected } from './comp-utils';
import { navigateToBl } from '../logic';
import { BookScreenLayout, LibraryScreenLayout } from './ScreenComp.Layout';

export const ScreenComp: Comp<Screen> = (props =>
    props.screen === 'book' ? <BookScreenComp {...props} />
        : props.screen === 'library' ? <LibraryScreenComp {...props} />
                : assertNever(props)
);

const BookScreenComp = connected(['controlsVisible'], ['toggleControls'])<BookScreen>(props =>
    <BookScreenLayout onContentClick={() => props.toggleControls()} showControls={props.controlsVisible}>
        <BookComp {...props.book} />
    </BookScreenLayout>
);

const LibraryScreenComp = comp<LibraryScreen>(props =>
    <LibraryScreenLayout>
        <LibraryComp {...props.library} openBook={bl => navigateToBl(bl)} />
    </LibraryScreenLayout>
);

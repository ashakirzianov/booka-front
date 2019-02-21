import * as React from 'react';

import { Screen, BookScreen, LibraryScreen, TocScreen } from '../model';
import { BookComp } from './BookComp';
import { LibraryComp } from './LibraryComp';
import { assertNever } from '../utils';
import { Comp, comp, connected } from './comp-utils';
import { navigateToBl } from '../logic';
import { BookScreenLayout, LibraryScreenLayout, TocScreenLayout } from './ScreenComp.Layout';
import { TableOfContentsComp } from './TableOfContentsComp';

export const ScreenComp: Comp<Screen> = (props =>
    props.screen === 'book' ? <BookScreenComp {...props} />
        : props.screen === 'library' ? <LibraryScreenComp {...props} />
            : props.screen === 'toc' ? <TocScreenComp {...props} />
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

const TocScreenComp = comp<TocScreen>(props =>
    <TocScreenLayout>
        <TableOfContentsComp {...props.toc} />
    </TocScreenLayout>
);

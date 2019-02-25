import * as React from 'react';

import { Screen, BookScreen, LibraryScreen, TocScreen, LoadingScreen } from '../model';
import { BookComp } from './BookComp';
import { LibraryComp } from './LibraryComp';
import { assertNever } from '../utils';
import { Comp, comp, connected } from './comp-utils';
import { BookScreenLayout, LibraryScreenLayout, TocScreenLayout } from './ScreenComp.Layout';
import { TableOfContentsComp } from './TableOfContentsComp';
import { ActivityIndicator } from 'react-native';

export const ScreenComp: Comp<Screen> = (props =>
    props.screen === 'book' ? <BookScreenComp {...props} />
        : props.screen === 'library' ? <LibraryScreenComp {...props} />
            : props.screen === 'toc' ? <TocScreenComp {...props} />
                : props.screen === 'loading' ? <LoadingScreenComp {...props} />
                    : assertNever(props)
);

const LoadingScreenComp: Comp<LoadingScreen> = (props =>
    <ActivityIndicator />
);

const BookScreenComp = connected(['controlsVisible'], ['toggleControls'])<BookScreen>(props =>
    <BookScreenLayout bi={props.book.id} onContentClick={() => props.toggleControls()} showControls={props.controlsVisible}>
        <BookComp {...props.book} />
    </BookScreenLayout>,
);

const LibraryScreenComp = comp<LibraryScreen>(props =>
    <LibraryScreenLayout>
        <LibraryComp {...props.library} />
    </LibraryScreenLayout>,
);

const TocScreenComp = comp<TocScreen>(props =>
    <TocScreenLayout>
        <TableOfContentsComp {...props.toc} />
    </TocScreenLayout>,
);

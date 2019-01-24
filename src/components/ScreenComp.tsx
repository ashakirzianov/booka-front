import * as React from 'react';

import { Screen } from '../model';
import { BookComp } from './BookComp';
import { LibraryComp } from './LibraryComp';
import { assertNever } from '../utils';
import { Comp } from './comp-utils';

export const ScreenComp: Comp<Screen> = (props =>
    props.screen === 'book' ? <BookComp {...props.book} />
        : props.screen === 'library' ? <LibraryComp {...props.library} />
            : assertNever(props)
);

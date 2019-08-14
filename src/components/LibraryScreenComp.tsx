import * as React from 'react';

import { LibraryScreen, Theme } from '../model';
import { Triad } from '../blocks';
import { LibraryComp } from './LibraryComp';
import { TextLine } from './Connected';
import { AccountButton } from './AccountButton';

export type LibraryScreenHeaderProps = {
    theme: Theme,
};
export function LibraryScreenHeader({ theme }: LibraryScreenHeaderProps) {
    return <Triad
        center={<TextLine text='Library' />}
        right={<AccountButton theme={theme} />}
    />;
}

export type LibraryScreenProps = {
    screen: LibraryScreen,
};
export function LibraryScreenComp({ screen }: LibraryScreenProps) {
    return <LibraryComp library={screen.library} />;
}

import * as React from 'react';

import { LibraryScreen, Theme, User } from '../model';
import { Triad } from '../blocks';
import { LibraryComp } from './LibraryComp';
import { TextLine, IconButton, connectState } from './Connected';
import { AccountButton } from './AccountButton';

export type LibraryScreenHeaderProps = {
    theme: Theme,
};
export function LibraryScreenHeader({ theme }: LibraryScreenHeaderProps) {
    return <Triad
        center={<TextLine text='Library' />}
        right={
            <>
                <UploadButton />
                <AccountButton theme={theme} />
            </>
        }
    />;
}

export type LibraryScreenProps = {
    screen: LibraryScreen,
};
export function LibraryScreenComp({ screen }: LibraryScreenProps) {
    return <LibraryComp library={screen.library} />;
}

type UploadButtonProps = {
    user: User | undefined,
};
function UploadButtonC({ user }: UploadButtonProps) {
    return user
        ? <IconButton icon='upload' />
        : null;
}
const UploadButton = connectState('user')(UploadButtonC);

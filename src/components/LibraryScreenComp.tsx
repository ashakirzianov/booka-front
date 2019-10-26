import * as React from 'react';

import { LibraryScreen, Theme, User, HasTheme } from '../model';
import {
    Triad, FileUploadDialog, FileUploadDialogRef,
    TextLine, IconButton,
} from '../atoms';
import { LibraryComp } from './LibraryComp';
import { AccountButton } from './AccountButton';
import { uploadBook } from '../api';

export type LibraryScreenHeaderProps = {
    theme: Theme,
    user: User | undefined,
};
export function LibraryScreenHeader({ theme, user }: LibraryScreenHeaderProps) {
    return <Triad
        center={
            <TextLine
                theme={theme}
                text='Library'
            />
        }
        right={
            <>
                <UploadButton theme={theme} user={user} />
                <AccountButton theme={theme} user={user} />
            </>
        }
    />;
}

export type LibraryScreenProps = HasTheme & {
    screen: LibraryScreen,
};
export function LibraryScreenComp({ screen, theme }: LibraryScreenProps) {
    return <LibraryComp
        theme={theme}
        library={screen.library}
    />;
}

type UploadButtonProps = HasTheme & {
    user: User | undefined,
};
export function UploadButton({ user, theme }: UploadButtonProps) {
    const uploadRef = React.useRef<FileUploadDialogRef>();
    return user
        ? <>
            <FileUploadDialog
                accept='application/epub+zip'
                dataKey='book'
                refCallback={r => uploadRef.current = r}
                onFilesSelected={async data => {
                    await uploadBook(data.data, user.token);
                }}
            />
            <IconButton
                theme={theme}
                icon='upload'
                onClick={() => uploadRef.current && uploadRef.current.show()}
            />
        </>
        : null;
}

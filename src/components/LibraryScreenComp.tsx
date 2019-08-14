import * as React from 'react';

import { LibraryScreen, Theme, User } from '../model';
import { Triad, FileUploadDialog, FileUploadDialogRef } from '../blocks';
import { LibraryComp } from './LibraryComp';
import { TextLine, IconButton, connectState } from './Connected';
import { AccountButton } from './AccountButton';
import { uploadBook } from '../api';

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
    const uploadRef = React.useRef<FileUploadDialogRef>();
    return user
        ? <>
            <FileUploadDialog
                dataKey='book'
                refCallback={r => uploadRef.current = r}
                onFilesSelected={async data => {
                    await uploadBook(data.data, user.token);
                }}
            />
            <IconButton
                icon='upload'
                onClick={() => uploadRef.current && uploadRef.current.show()}
            />
        </>
        : null;
}
const UploadButton = connectState('user')(UploadButtonC);

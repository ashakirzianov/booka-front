import * as React from 'react';

import { LibraryScreen } from '../model';
import { Row } from '../blocks';
import { LibraryComp } from './LibraryComp';
import { TextLine } from './Connected';

export function LibraryScreenHeader() {
    return <Row centered fullWidth>
        <TextLine text='Library' />
    </Row>;
}

export type LibraryScreenProps = {
    screen: LibraryScreen,
};
export function LibraryScreenComp({ screen }: LibraryScreenProps) {
    return <LibraryComp library={screen.library} />;
}

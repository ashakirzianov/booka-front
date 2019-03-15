import * as React from 'react';

import { Column, FullScreen } from './Elements';
import { ScreenComp } from './ScreenComp';
import { connected } from './comp-utils';

export const TopComp = connected(['screen'])((props) =>
    <FullScreen color='black'>
        <Column style={{ alignItems: 'center' }}>
            {<ScreenComp {...props.screen} />}
        </Column>
    </FullScreen>,
);

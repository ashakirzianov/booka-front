import * as React from 'react';

import { connected, Column, FullScreen } from '../blocks';
import { ScreenComp } from './ScreenComp';

export const TopComp = connected(['screen'])((props) =>
    <FullScreen color='black'>
        <Column style={{ alignItems: 'center' }}>
            {<ScreenComp {...props.screen} />}
        </Column>
    </FullScreen>,
);

import * as React from 'react';

import { connected, Column, Layer } from '../blocks';
import { ScreenComp } from './ScreenComp';

export const TopComp = connected(['screen'])((props) =>
    <Layer>
        <Column style={{ alignItems: 'center' }}>
            {<ScreenComp {...props.screen} />}
        </Column>
    </Layer>,
);

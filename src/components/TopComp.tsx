import * as React from 'react';

import { connectState, Column, Layer } from '../blocks';
import { ScreenComp } from './ScreenComp';

export const TopComp = connectState('screen')((props) =>
    <Layer>
        <Column style={{ alignItems: 'center' }}>
            {<ScreenComp {...props.screen} />}
        </Column>
    </Layer>,
);

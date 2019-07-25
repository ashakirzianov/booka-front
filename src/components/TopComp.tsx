import * as React from 'react';

import { Column, Layer } from '../blocks';
import { ScreenComp } from './ScreenComp';
import { connectState } from './common';

export const TopComp = connectState('screen', 'theme')(function TopCompC(props) {
    return <Layer theme={props.theme}>
        <Column centered>
            <ScreenComp screen={props.screen} />
        </Column>
    </Layer>;
});

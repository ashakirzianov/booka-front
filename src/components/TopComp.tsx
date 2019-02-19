import * as React from "react";

import { Column, ScreenLayout } from "./Elements";
import { ScreenComp } from './ScreenComp';
import { connected } from './comp-utils';

export const TopComp = connected(['screen'])((props) =>
    <ScreenLayout color='black'>
        <Column style={{align: 'center'}}>
            { <ScreenComp {...props.screen} /> }
        </Column>
    </ScreenLayout>
);
import * as React from "react";

import { Column, ScreenLayout } from "./Elements";
import { ScreenComp } from './ScreenComp';
import { connected } from './comp-utils';
import { buildTopScreen } from '../logic';

export const TopComp = connected(['screenStack'])((props) =>
    <ScreenLayout color='black'>
        <Column align='center'>
            { <ScreenComp {...buildTopScreen(props.screenStack)} /> }
        </Column>
    </ScreenLayout>
);
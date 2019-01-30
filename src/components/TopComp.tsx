import * as React from "react";

import { Column, Screen } from "./Elements";
import { ScreenComp } from './ScreenComp';
import { topScreen } from '../model';
import { connected } from './comp-utils';

export const TopComp = connected(['screenStack'])((props) =>
    <Screen color='black'>
        <Column align='center'>
            {
                <ScreenComp {...topScreen(props.screenStack)} />
            }
        </Column>
    </Screen>
);
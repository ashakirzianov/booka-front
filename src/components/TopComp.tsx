import * as React from "react";

import { Column, ScreenLayout } from "./Elements";
import { ScreenComp } from './ScreenComp';
import { topScreen } from '../model';
import { connected } from './comp-utils';

export const TopComp = connected(['screenStack'], ['navigateToScreen'])((props) =>
    <ScreenLayout color='black'>
        <Column align='center'>
            {
                <ScreenComp
                    navigateToScreen={props.navigateToScreen}
                    {...topScreen(props.screenStack)}
                    />
            }
        </Column>
    </ScreenLayout>
);
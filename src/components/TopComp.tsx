import * as React from "react";

import { Column, Screen } from "./Elements";
import { ScreenComp } from './ScreenComp';
import { topScreen } from '../model';
import { connect } from './higherLevel';

export const TopComp = connect(['screenStack'])((props) =>
    <Screen color='black'>
        <Column align='center'>
            {
                <ScreenComp {...topScreen(props.screenStack)} />
            }
        </Column>
    </Screen>
);
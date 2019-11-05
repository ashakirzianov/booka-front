import * as React from 'react';
import { connect } from 'react-redux';

import { Column, Layer } from '../atoms';
import { ScreenComp } from './ScreenComp';
import { App } from '../model';

type TopProps = {
    state: App,
};
function TopComp({ state }: TopProps) {
    return <Layer theme={state.theme}>
        <Column centered>
            <ScreenComp
                theme={state.theme}
                screen={state.screen}
                controlsVisible={state.controlsVisible}
                loading={state.loading}
                user={state.user}
            />
        </Column>
    </Layer>;
}

export const ConnectedTopCom = connect(
    (state: App) => ({ state }),
)(TopComp);

import * as React from "react";

import { Column, Screen } from "./Elements";
import { history, connect, dispatchNavigationEvent } from "./misc";
import { ScreenComp } from './ScreenComp';
import { topScreen } from '../model';

export class AppComp extends React.Component {
    public componentWillMount() {
        // TODO: this doesn't feel right. Think of another way.
        dispatchNavigationEvent(history.location.pathname);
        history.listen((location, action) => {
            dispatchNavigationEvent(location.pathname);
        });
    }

    public render() {
        return <TopComp />;
    }
}

const TopComp = connect(['screenStack'])((props) =>
    <Screen color='black'>
        <Column align='center'>
            {
                <ScreenComp {...topScreen(props.screenStack)} />
            }
        </Column>
    </Screen>

);

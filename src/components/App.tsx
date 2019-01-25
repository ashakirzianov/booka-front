import * as React from "react";

import { Column, Screen } from "./Elements";
import { history, connect, dispatchNavidationEvent } from "./misc";
import { ScreenComp } from './ScreenComp';

export class AppComp extends React.Component {
    public componentWillMount() {
        // TODO: this doesn't feel right. Think of another way.
        dispatchNavidationEvent(history.location.pathname);
        history.listen((location, action) => {
            dispatchNavidationEvent(location.pathname);
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
                props.screenStack.length > 0 ? <ScreenComp {...props.screenStack[0]} /> : '' // TODO: better handle empty stack situation
            }
        </Column>
    </Screen>

);

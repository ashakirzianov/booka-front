import * as React from "react";

import { Column, Screen } from "./Elements";
import { dispatchHistoryEvent, history, connect } from "./misc";
import { ScreenComp } from './ScreenComp';

export class AppComp extends React.Component {
    public componentWillMount() {
        // TODO: this doesn't feel right. Think of another way.
        dispatchHistoryEvent(history.location);
        history.listen((location, action) => {
            dispatchHistoryEvent(location, action);
        });
    }

    public render() {
        return <TopComp />;
    }
}

const TopComp = connect(['screen'])((props) =>
    <Screen color='black'>
        <Column align='center'>
            <ScreenComp {...props.screen} />
        </Column>
    </Screen>

);

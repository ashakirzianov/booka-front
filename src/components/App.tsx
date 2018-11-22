import * as React from "react";
import { TopComp } from "./BookComp";
import { Router } from "react-router-dom";
import { dispatchHistoryEvent, history } from "./misc";

export class AppComp extends React.Component {
    public componentWillMount() {
        // TODO: this doesn't feel right. Think of another way.
        dispatchHistoryEvent(history.location);
        history.listen((location, action) => {
            dispatchHistoryEvent(location, action);
        });
    }

    public render() {
        return <Router history={history}>
            <TopComp />
        </Router>;
    }
}

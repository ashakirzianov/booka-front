import * as React from "react";
import { BookComp } from "./BookComp";
import { Switch, Router, Redirect, Route } from "./Elements";
import { dispatchHistoryEvent, history, connect } from "./misc";

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

const TopComp = connect(['book'])((props) =>
    <Switch>
        <Redirect push exact from='/' to='/wap' />
        <Route path='/' render={
            // tslint:disable-next-line:jsx-no-lambda
            () => <BookComp {...props.book} />
        } />
    </Switch>
);

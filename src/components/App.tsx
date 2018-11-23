import * as React from "react";
import { BookComp } from "./BookComp";
import { Switch, Router, Route } from "./Elements";
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
        <Route exact path='/' />
        <Route path='/book/:name' render={
            // tslint:disable-next-line:jsx-no-lambda
            () => <BookComp {...props.book} />
        } />
    </Switch>
);

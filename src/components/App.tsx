import * as React from "react";
import { BookComp } from "./BookComp";
import { Switch, Router, Route, Column, Screen } from "./Elements";
import { dispatchHistoryEvent, history, connect } from "./misc";
import { LibraryComp } from './LibraryComp';

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

const TopComp = connect(['book', 'library'])((props) =>
    <Screen color='black'>
        <Column align='center'>
            <Switch>
                <Route exact path='/' render={
                    // tslint:disable-next-line:jsx-no-lambda
                    () => <LibraryComp {...props.library} />
                } />
                <Route path='/book/:name' render={
                    // tslint:disable-next-line:jsx-no-lambda
                    () => <BookComp {...props.book} />
                } />
            </Switch>
        </Column>
    </Screen>

);

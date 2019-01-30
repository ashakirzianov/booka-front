import * as React from "react";
import { TopComp } from './TopComp';
import { dispatchNavigationEvent } from '../redux';

import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

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

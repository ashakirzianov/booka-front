import * as React from 'react';
import { dispatchNavigationEvent } from '../redux';
import { TopComp } from './TopComp';
import { history } from './misc';

export class EntryComp extends React.Component {
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
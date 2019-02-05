import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppComp } from './components';
import { dispatchNavigationEvent } from "./redux";
import registerServiceWorker from './registerServiceWorker';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
dispatchNavigationEvent(history.location.pathname);
history.listen((location, action) => {
    dispatchNavigationEvent(location.pathname);
});

ReactDOM.render(
  <AppComp />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppComp } from './components';
import registerServiceWorker from './registerServiceWorker';
import { subscribe } from './redux';

ReactDOM.render(
  <AppComp />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
subscribe();

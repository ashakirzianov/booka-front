import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppComp } from './components';
import registerServiceWorker from './registerServiceWorker';
import { onInit } from './logic';

onInit();
ReactDOM.render(
  <AppComp />,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();

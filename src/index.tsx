import 'resize-observer-polyfill/dist/ResizeObserver.global';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppComp } from './components';
import registerServiceWorker from './registerServiceWorker';
import { wireHistoryNavigation } from './logic';

wireHistoryNavigation();
ReactDOM.render(
  <AppComp />,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();

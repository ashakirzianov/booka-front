import 'resize-observer-polyfill/dist/ResizeObserver.global';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { wireHistoryNavigation } from './logic';
import { AppComp } from './components';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <AppComp />,
  document.getElementById('root') as HTMLElement
);
wireHistoryNavigation();
registerServiceWorker();

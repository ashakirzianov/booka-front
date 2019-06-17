import 'resize-observer-polyfill/dist/ResizeObserver.global';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { wireCore } from './core';
import { AppComp } from './components';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <AppComp />,
  document.getElementById('root') as HTMLElement
);
wireCore();
registerServiceWorker();

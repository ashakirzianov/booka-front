import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { AppComp } from './components';
import { ConnectedProvider } from "./redux";
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <ConnectedProvider><AppComp /></ConnectedProvider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

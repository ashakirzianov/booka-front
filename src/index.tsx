import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { AppComp } from './components';
import { store } from "./redux";
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider store={store}><AppComp /></Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

import * as React from 'react';

import { ConnectedProvider } from '../redux';
import { TopComp } from './TopComp';

const App: React.SFC = props =>
    <ConnectedProvider><TopComp /></ConnectedProvider>;

export { App as AppComp };

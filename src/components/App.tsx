import * as React from 'react';
import { TopComp } from './TopComp';
import { ConnectedProvider } from '../redux';
// import { ElementsStore } from './ComponentsStore';

const App: React.SFC = props =>
    <ConnectedProvider><TopComp /></ConnectedProvider>;

export { App as AppComp };

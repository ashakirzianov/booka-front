import React from 'react';

import { AppComp } from './src/components';
import { ConnectedProvider, dispatchNavigationEvent } from "./src/redux";

// TODO: think of better solution
dispatchNavigationEvent('/');
export default class App extends React.Component {
  render() {
    return (
      <ConnectedProvider><AppComp /></ConnectedProvider>
    );
  }
}

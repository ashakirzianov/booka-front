import React from 'react';

import { AppComp } from './src/components';
import { ConnectedProvider, wireCore } from './src/core';

export default class App extends React.Component {
  render() {
    return (
      <ConnectedProvider><AppComp /></ConnectedProvider>
    );
  }
}

wireCore();

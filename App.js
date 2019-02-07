import React from 'react';

import { AppComp } from './src/components';
import { ConnectedProvider } from "./src/redux";
import { onInit } from './src/logic';

export default class App extends React.Component {
  render() {
    return (
      <ConnectedProvider><AppComp /></ConnectedProvider>
    );
  }
}

onInit();

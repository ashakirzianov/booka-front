import React from 'react';

import { AppComp } from './src/components';
import { ConnectedProvider, subscribe } from "./src/redux";

export default class App extends React.Component {
  componentWillMount() {
    subscribe();
  }
  
  render() {
    return (
      <ConnectedProvider><AppComp /></ConnectedProvider>
    );
  }
}

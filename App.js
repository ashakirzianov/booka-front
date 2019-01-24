import React from 'react';

import { Provider } from 'react-redux';

import { AppComp } from './src/components';
import { store } from "./src/redux";

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}><AppComp /></Provider>
    );
  }
}

import React from 'react';

export default class NativeApp extends React.Component {
  render() {
    return React.createElement('div', null, ['Hello']);
  }
}
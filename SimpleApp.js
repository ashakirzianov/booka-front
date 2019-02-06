import React from 'react';

import { Provider, connect } from 'react-redux';
import { View, Text, SafeAreaView } from 'react-native';

import { createStore } from 'redux';

const TestComp = props =>
  <View>
    <SafeAreaView>
      <Text onPress={() => props.do()}>World: {props.test}</Text>
    </SafeAreaView>
  </View>;

function reducer(store, action) {
  switch (action.type) {
    case 'do':
      return { test: store.test + '!' };
    default:
      return store;
  }
}

const store = createStore(reducer, { test: ' hello' });

const Connected = connect(
  state => ({ test: state.test }),
  dispatch => ({ do: () => dispatch({ type: 'do' }) }),
)(TestComp);

export default class App extends React.Component {
  render() {
    return <Provider store={store}>
      <View style={{ flexDirection: 'column-reverse' }}>
        <Connected />
      </View>
    </Provider>;
  }
}

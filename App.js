import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import RootNavigator from './src/views/navigator/root_navigator';

export default class App extends Component {
  render() {
    return (
      <RootNavigator />
    );
  }
}
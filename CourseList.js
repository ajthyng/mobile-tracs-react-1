import React, {Component} from 'react';
import {View, Text, WebView, StyleSheet} from 'react-native';
import {StackNavigator} from 'react-navigation';
import LoginScreen from "./LoginScreen";

class CourseList extends Component {
  static navigationOptions = {
    title: "Site List"
  };
  render() {
    const { params } = this.props.navigation.state;
    return (
        <WebView
          source={{uri: "https://tracs.txstate.edu/portal/pda"}}/>
    );
  }
}

const SimpleApp = StackNavigator({
  Home: { screen: LoginScreen },
  SiteList: { screen: CourseList }
});
export default SimpleApp;
import React, {Component} from 'react';
import { Actions } from 'react-native-router-flux';
import {View, Text, WebView, Platform, StyleSheet} from 'react-native';
import {StackNavigator} from 'react-navigation';
import WKWebView from 'react-native-wkwebview-reborn';


class CourseList extends Component {
  static navigationOptions = {
    title: "Site List"
  };

  render() {
    const { params } = this.props.navigation.state;
    let uri = "https://tracs.txstate.edu/portal/pda";
    let webView;
		if (Platform.OS === 'ios') {
      webView = <WKWebView
				sendCookies={true}
				source={{uri: uri}}/>;
		} else {
		  webView = <WebView
        source={{uri: uri}}/>;
    }
		return (
			webView
		);
  }
}

export default CourseList;
import React, {Component} from 'react';
import {View, Text, Button, StyleSheet, TextInput} from 'react-native';
import { StackNavigator } from 'react-navigation';

class LoginScreen extends Component {
  static navigationOptions = {
    title: 'LoginScreen',
  };

  constructor(props) {
    super(props);
    this.state = {
      netid: " ",
      password: " "
    };
    this.getRegistrationToken = this.getRegistrationToken.bind(this);
  }

  getRegistrationToken() {
    let auth64 = `${this.state.netid}:${this.state.password}`;
    auth64 = btoa(auth64);
    fetch("https://dispatch.its.txstate.edu:3000/token.pl", {
      method: "get",
      headers: {
        "Authorization": `Basic ${auth64}`
      }
    }).then( (res) => {
      if (res.ok) {
        fetch(`https://tracs.txstate.edu/portal/relogin?eid=${this.state.netid}&pw=${this.state.password}`, {
          method: "post",
          credentials: 'include',
        }).then( (res) => {
          if (res.ok) {
            const { navigate } = this.props.navigation;
            navigate('SiteList', {});
          }
        })
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to TRACS Mobile</Text>
        <TextInput
          onChangeText={(netid) => this.setState({ netid })}
          placeholder="Net ID"/>
        <TextInput
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
          placeholder="Password"/>
        <Button
          onPress={this.getRegistrationToken}
          title="Login" />
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    margin: 32,
  },
  netid: {
  },
  password: {
  },
  submit: {
  }
});

export default LoginScreen;
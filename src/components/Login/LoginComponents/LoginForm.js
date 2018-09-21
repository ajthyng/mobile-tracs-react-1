import React from 'react'
import styled from 'styled-components'
import { Platform } from 'react-native'
import LoginButton from './LoginButton'

const Container = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: ${props => props.portrait ? 0 : 40}px;
  width: ${props => props.portrait ? '65%' : '40%'};
`

const SignInText = styled.Text`
  color: #959595;
`

const NetID = styled.TextInput`
  width: 100%;
  height: 40px;
`

const Password = styled.TextInput`
  width: 100%;
  height: 40px;
`

const underlineStyle = Platform.select({
  android: {},
  ios: {
    borderBottomWidth: 1,
    borderBottomColor: '#00547e'
  }
})

const keyboardType = Platform.select({
  ios: 'default',
  android: 'visible-password'
})

const signInMessage = 'Sign in to your account'

const LoginForm = function (props) {
  const {
    portrait,
    netid, password,
    onChangeText,
    onSubmitEditing,
    onLayout,
    onPress
  } = props

  return (
    <Container portrait={portrait}>
      {portrait ? null : <SignInText>{signInMessage}</SignInText>}
      <NetID
        style={underlineStyle}
        innerRef={c => { this.netid = c }}
        placeholder='Net ID'
        placeholderTextColor='#000000'
        underlineColorAndroid='#000000'
        selectionColor='#909090'
        autoCapitalize='none'
        autoCorrect={false}
        returnKeyType='next'
        keyboardType={keyboardType}
        value={netid}
        onChangeText={text => onChangeText({ netid: text })}
        onSubmitEditing={() => this.password.focus()}
      />
      <Password
        secureTextEntry
        style={underlineStyle}
        innerRef={c => { this.password = c }}
        placeholder='Password'
        placeholderTextColor='#000000'
        underlineColorAndroid='#000000'
        selectionColor='#909090'
        autoCapitalize='none'
        autoCorrect={false}
        returnKeyType='send'
        value={password}
        onChangeText={text => onChangeText({ password: text })}
        onSubmitEditing={onSubmitEditing}
      />
      <LoginButton
        onLayout={onLayout}
        onPress={onPress}
      />
    </Container>
  )
}

LoginForm.defaultProps = {
  portrait: true,
  netid: '',
  password: '',
  onChangeText: () => null,
  onSubmitEditing: () => null,
  onLayout: () => null,
  onPress: () => null
}

export default LoginForm

import React from 'react'
import styled from 'styled-components'
import {Dimensions, StatusBar, Platform} from 'react-native'
import LoginPage from './LoginComponents/LoginPage'
import LoginGreeting from './LoginComponents/LoginGreeting'
import LoginForm from './LoginComponents/LoginForm'
import UPPSText from './LoginComponents/UPPSText'
import {getOrientation, PORTRAIT} from '../../utils/orientation'

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: #fff;
`

const KeyboardScroll = styled.ScrollView`
  background-color: white;
`

const Login = (props) => {
    const portrait = getOrientation() === PORTRAIT
    const {height} = Dimensions.get('window')
    const statusBarHeight = Platform.select({
      ios: height,
      android: height - StatusBar.currentHeight
    })

    const {
      netid, password,
      onChangeText,
      onSubmitEditing,
      onLayout,
      onPress,
      getRef
    } = props

    return (
      <KeyboardScroll
        innerRef={c => getRef(c)}
        contentViewStyle={{height: '100%'}}
        scrollEnabled
        keyboardDismissMode='none'
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps='handled'
      >
        <Container style={{height: statusBarHeight}}>
          <LoginPage portrait={portrait}>
            <LoginGreeting />
            <LoginForm
              netid={netid}
              password={password}
              onChangeText={onChangeText}
              onSubmitEditing={onSubmitEditing}
              onLayout={onLayout}
              onPress={onPress}
            />
          </LoginPage>
          <UPPSText />
        </Container>
      </KeyboardScroll>
    )
}

export default Login
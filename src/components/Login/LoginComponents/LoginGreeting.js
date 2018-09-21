import React from 'react'
import styled from 'styled-components'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const TracsLogo = styled.Image`
  width: ${props => props.portrait ? '80' : '120'}px;
  height: ${props => (props.portrait ? 80 : 120) * 1378 / 1438}px;
  margin-bottom: 16px;
`

const GreetingText = styled.Text`
  color: #00547e;
  font-size: 20px;
`

const SignInText = styled.Text`
  color: #959595;
`

const signInMessage = 'Sign in to your account'

const LoginGreeting = (props) => {
  const { portrait } = props
  return (
    <Container portrait={portrait}>
      <TracsLogo portrait={portrait} source={require('../../../../img/tracs.png')} />
      <GreetingText>Welcome to TRACS</GreetingText>
      {portrait ? <SignInText>{signInMessage}</SignInText> : null}
    </Container>
  )
}

LoginGreeting.defaultProps = {
  portrait: true
}

export default LoginGreeting

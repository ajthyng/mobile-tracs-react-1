import React from 'react'
import styled from 'styled-components'

const Container = styled.View`
  flex: 1;
  flex-direction: ${props => props.portrait ? 'column' : 'row'};
  padding-top: ${props => props.portrait ? '30%' : '0'};
  align-items: center;
  justify-content: ${props => props.portrait ? 'center' : 'space-around'};
  background-color: #ffffff;
  width: 100%;
`

const LoginPage = props => (
  <Container portrait={props.portrait}>
    {
      React.Children.map(props.children, child => (
        React.cloneElement(child, { portrait: props.portrait })
      ))
    }
  </Container>
)

LoginPage.defaultProps = {
  portrait: true
}

export default LoginPage

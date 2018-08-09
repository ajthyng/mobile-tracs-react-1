import React, {Component} from 'react'
import styled from 'styled-components'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.viewBackground};
  width: 100%;
`

const Title = styled.Text`
  align-self: flex-start;
  font-size: 22px;
  padding: 8px 8px 8px 16px;
  color: ${props => props.theme.darkText};
`

const Message = ({title}) => (
  <TouchableWithoutFeedback onPress={() => console.log(`${title}`)}>
    <Container>
      <Title>{title}</Title>
    </Container>
  </TouchableWithoutFeedback>
)

export default Message